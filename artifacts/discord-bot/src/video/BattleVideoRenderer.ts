import { childLogger } from '../utils/logger.js';

const log = childLogger('BattleVideoRenderer');

export type VideoFormat = 'gif' | 'mp4';

export interface BattleVideoOptions {
  battleId: string;
  frames: Buffer[];
  format: VideoFormat;
  fps?: number;
}

/**
 * BattleVideoRenderer — stitches battle frames into GIF or MP4.
 *
 * PLACEHOLDER: Will use ffmpeg-static + fluent-ffmpeg.
 * GIF is the default (inline Discord playback).
 * MP4 is premium — sent as an attachment.
 * Both must stay under Discord's 8MB attachment limit.
 */
export class BattleVideoRenderer {
  async render(options: BattleVideoOptions): Promise<Buffer> {
    log.info('BattleVideoRenderer.render — placeholder', {
      battleId: options.battleId,
      format: options.format,
    });
    // TODO: Implement ffmpeg rendering
    return Buffer.alloc(0);
  }
}
