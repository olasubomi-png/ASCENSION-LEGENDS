import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} from 'discord.js';

import type { CharacterService } from '../services/character/CharacterService.js';
import type { EconomyService } from '../services/economy/EconomyService.js';
import type { ProfileService } from '../services/profile/ProfileService.js';
import type { RegistrationService } from '../services/registration/RegistrationService.js';
import type {
  AutocompleteHandler,
  ButtonHandler,
  ModalHandler,
  SelectMenuHandler,
  SlashCommand,
} from '../types/discord.js';

/**
 * AscensionClient — extends discord.js Client with:
 *   - command/button/select/modal/autocomplete registries
 *   - service references (DI container) so command handlers can access them
 */
export class AscensionClient extends Client {
  public readonly commands = new Collection<string, SlashCommand>();
  public readonly buttons = new Collection<string | RegExp, ButtonHandler>();
  public readonly selectMenus = new Collection<string | RegExp, SelectMenuHandler>();
  public readonly modals = new Collection<string | RegExp, ModalHandler>();
  public readonly autocomplete = new Collection<string, AutocompleteHandler>();

  // Service references — set by bootstrap after DI wiring
  public registrationService?: RegistrationService;
  public characterService?: CharacterService;
  public economyService?: EconomyService;
  public profileService?: ProfileService;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.User],
      allowedMentions: { parse: ['users'], repliedUser: false },
    });
  }
}
