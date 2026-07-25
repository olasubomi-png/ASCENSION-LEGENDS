import { childLogger } from '../../utils/logger.js';

const log = childLogger('SkillsService');

/**
 * SkillsService — manages character skill trees and ability unlocks.
 *
 * PLACEHOLDER: Will implement skill progression, unlock conditions,
 * and cooldown tracking per ADR-007 (deterministic resolution).
 */
export class SkillsService {
  async getSkills(_characterId: string): Promise<void> {
    log.info('SkillsService.getSkills — placeholder');
    throw new Error('Skills system not yet implemented');
  }

  async unlockSkill(_characterId: string, _skillId: string): Promise<void> {
    log.info('SkillsService.unlockSkill — placeholder');
    throw new Error('Skills system not yet implemented');
  }
}
