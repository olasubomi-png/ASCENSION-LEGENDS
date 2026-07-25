import { childLogger } from '../utils/logger.js';

const log = childLogger('ProfileCardRenderer');

export interface ProfileCardData {
  userId: string;
  username: string;
  level: number;
  className: string;
  gold: number;
  gems: number;
  avatarUrl?: string;
}

/**
 * ProfileCardRenderer — generates a profile card image.
 *
 * PLACEHOLDER: Will use node-canvas to produce a styled PNG/Buffer.
 * ADR-011: Rendering runs in isolated BullMQ workers to avoid
 * blocking the main event loop.
 */
export class ProfileCardRenderer {
  async render(_data: ProfileCardData): Promise<Buffer> {
    log.info('ProfileCardRenderer.render — placeholder');
    // TODO: Implement Canvas rendering
    return Buffer.alloc(0);
  }
}
