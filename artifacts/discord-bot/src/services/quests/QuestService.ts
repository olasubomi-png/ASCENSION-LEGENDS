import { childLogger } from '../../utils/logger.js';

const log = childLogger('QuestService');

/**
 * QuestService — manages quest assignment, progression, and completion rewards.
 *
 * PLACEHOLDER: Will implement quest templates, progress tracking,
 * and reward distribution via EconomyService and InventoryService.
 */
export class QuestService {
  async getActiveQuests(_userId: string): Promise<void> {
    log.info('QuestService.getActiveQuests — placeholder');
    throw new Error('Quest system not yet implemented');
  }

  async completeQuest(_userId: string, _questId: string): Promise<void> {
    log.info('QuestService.completeQuest — placeholder');
    throw new Error('Quest system not yet implemented');
  }
}
