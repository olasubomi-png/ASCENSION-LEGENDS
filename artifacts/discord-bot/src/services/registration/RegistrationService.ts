/**
 * RegistrationService — orchestrates /start player creation flow.
 *
 * Creates atomically (best-effort):
 *   1. User document
 *   2. Character document
 *   3. Wallet + starter gold
 *   4. Inventory + starter items
 *   5. Profile (power rating, prestige)
 *
 * Architecture: Repository Pattern + Service Layer (Book 3 §5)
 */

import type { ClassId } from '../../constants/classes.js';
import { CLASS_DEFINITIONS } from '../../constants/classes.js';
import { ID_PREFIXES } from '../../constants/index.js';
import type { IRegistrationService, RegistrationInput, RegistrationResult } from '../../interfaces/IRegistrationService.js';
import type { CharacterRepository, WalletRepository } from '../../repositories/index.js';
import type { Result } from '../../types/common.js';
import { err, ok } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';
import {
  calculatePowerRatingFromStats,
  STARTER_GOLD,
  STARTER_KIT,
} from '../../utils/statsCalculator.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';
import type { CharacterService } from '../character/CharacterService.js';
import type { EconomyService } from '../economy/EconomyService.js';
import type { InventoryService } from '../inventory/InventoryService.js';
import type { PlayerService } from '../player/PlayerService.js';
import type { ProfileService } from '../profile/ProfileService.js';

const log = childLogger('RegistrationService');

export class RegistrationService implements IRegistrationService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly characterService: CharacterService,
    private readonly economyService: EconomyService,
    private readonly inventoryService: InventoryService,
    private readonly profileService: ProfileService,
    private readonly walletRepo: WalletRepository,
    private readonly characterRepo: CharacterRepository,
  ) {}

  async isRegistered(discordId: string): Promise<boolean> {
    return this.characterService.hasCharacter(discordId);
  }

  async register(input: RegistrationInput): Promise<Result<RegistrationResult>> {
    const { discordId, username, characterName, classId } = input;

    try {
      log.info('Starting registration', { discordId, characterName, classId });

      // Guard: prevent duplicate registration
      if (await this.characterService.hasCharacter(discordId)) {
        return err(new Error('Player is already registered.'));
      }

      // 1. Create or get User document
      const playerResult = await this.playerService.getOrCreatePlayer(discordId, username);
      if (!playerResult.ok) return err(playerResult.error);
      const { id: userId } = playerResult.value;

      // 2. Create Character with class-based starting stats
      const characterResult = await this.characterService.createCharacter({
        userId,
        discordId,
        classId: classId as ClassId,
        name: characterName,
      });
      if (!characterResult.ok) return err(characterResult.error);
      const character = characterResult.value;

      // 3. Provision wallet + grant starter gold
      //    EconomyService.getBalance creates the wallet if absent
      const balanceResult = await this.economyService.getBalance(userId);
      if (!balanceResult.ok) return err(balanceResult.error);

      const goldResult = await this.economyService.credit(
        userId,
        STARTER_GOLD,
        'gold',
        'starter_reward',
      );
      if (!goldResult.ok) {
        log.warn('Failed to credit starter gold', { userId, err: String(goldResult.error) });
        // Non-fatal — continue registration
      }

      // 4. Create Inventory + starter items
      const classDef = CLASS_DEFINITIONS[classId as ClassId];
      void classDef; // used for stats below; items are a fixed kit

      const starterItems = STARTER_KIT.map((kit) => ({
        itemId: kit.itemId,
        quantity: kit.quantity,
        acquiredAt: new Date(),
        equipped: Boolean(kit.slot),
        slot: kit.slot,
      }));

      const inventoryResult = await this.inventoryService.createInventory(
        userId,
        discordId,
        starterItems,
      );
      if (!inventoryResult.ok) {
        log.warn('Failed to create inventory', { userId, err: String(inventoryResult.error) });
        // Non-fatal — continue
      }
      const inventoryId = inventoryResult.ok
        ? inventoryResult.value._id
        : generateIdWithPrefix(ID_PREFIXES.INVENTORY);

      // 5. Create Profile with computed Power Rating
      const powerRating = calculatePowerRatingFromStats(CLASS_DEFINITIONS[classId as ClassId].stats);
      const profileResult = await this.profileService.createProfile(
        userId,
        discordId,
        powerRating,
      );
      if (!profileResult.ok) {
        log.warn('Failed to create profile', { userId, err: String(profileResult.error) });
      }
      const profileId = profileResult.ok ? profileResult.value.profileId : '';

      log.info('Registration complete', {
        discordId,
        userId,
        characterId: character.characterId,
        classId,
        powerRating,
      });

      return ok({
        userId,
        characterId: character.characterId,
        inventoryId,
        profileId,
        characterName: character.name,
        classId: character.classId as ClassId,
        starterGold: STARTER_GOLD,
      });
    } catch (error) {
      log.error('Registration failed', { err: String(error), discordId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
