import { childLogger } from '../../utils/logger.js';

const log = childLogger('WorldService');

/**
 * WorldService — manages world state, zones, and environmental events.
 *
 * PLACEHOLDER: Will implement zone management, world events,
 * spawn logic, and environment-based modifiers for battle.
 */
export class WorldService {
  async getZoneInfo(_zoneId: string): Promise<void> {
    log.info('WorldService.getZoneInfo — placeholder');
    throw new Error('World system not yet implemented');
  }

  async getActiveWorldEvents(): Promise<void> {
    log.info('WorldService.getActiveWorldEvents — placeholder');
    throw new Error('World system not yet implemented');
  }
}
