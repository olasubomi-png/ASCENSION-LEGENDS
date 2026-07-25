import { childLogger } from '../../utils/logger.js';

const log = childLogger('TransformationsService');

/**
 * TransformationsService — manages character class transformations and evolutions.
 *
 * PLACEHOLDER: Will implement transformation prerequisites, cooldowns,
 * and stat modifications when a character changes form/class.
 */
export class TransformationsService {
  async getAvailableTransformations(_characterId: string): Promise<void> {
    log.info('TransformationsService.getAvailableTransformations — placeholder');
    throw new Error('Transformations system not yet implemented');
  }

  async applyTransformation(_characterId: string, _transformationId: string): Promise<void> {
    log.info('TransformationsService.applyTransformation — placeholder');
    throw new Error('Transformations system not yet implemented');
  }
}
