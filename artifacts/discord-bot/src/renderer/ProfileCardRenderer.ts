/**
 * ProfileCardRenderer — generates a profile card image using node-canvas.
 *
 * ADR-011: Canvas rendering runs in isolated BullMQ workers to avoid blocking
 * the main event loop. For Sprint 2 the renderer is called inline (MVP) and
 * will be moved to the render worker in a future sprint.
 *
 * Fallback: returns empty Buffer when canvas native deps are unavailable
 * (Replit environment — note in replit.md). The /profile command handles this
 * gracefully by displaying a rich embed instead.
 */

import type { ICharacterStats } from '../models/CharacterModel.js';
import { formatNumber } from '../utils/format.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('ProfileCardRenderer');

// ──────────────────────────────────────────────────────────────────────────────
// Canvas module — loaded dynamically at runtime to avoid compile-time errors.
// node-canvas is an optional peer dependency: not installed in the Replit
// sandbox, installed in production.
// ──────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CanvasModule = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Canvas2DContext = Record<string, any>;

export interface ProfileCardData {
  userId: string;
  username: string;
  level: number;
  className: string;
  classEmoji: string;
  gold: number;
  gems: number;
  stats: ICharacterStats;
  powerRating: number;
  powerRatingLabel: string;
  experience: number;
  experienceToNextLevel: number;
  prestigeLevel: number;
  battlesWon: number;
  battlesLost: number;
  guildId?: string | undefined;
  avatarUrl?: string | undefined;
}

export class ProfileCardRenderer {
  private canvas: CanvasModule | null = null;
  private initialized = false;

  private async tryLoadCanvas(): Promise<CanvasModule | null> {
    if (this.initialized) return this.canvas;
    this.initialized = true;
    try {
      // Dynamic import — canvas is an optional native dep; suppress the compile-time
      // module-not-found error since the package is intentionally absent in dev.
      // @ts-ignore — canvas is an optional peer dep not installed in dev
      const canvasMod = await import('canvas');
      this.canvas = canvasMod as CanvasModule;
      log.info('node-canvas loaded successfully');
      return this.canvas;
    } catch {
      log.warn('node-canvas not available — profile cards will use embed fallback');
      return null;
    }
  }

  async render(data: ProfileCardData): Promise<Buffer> {
    const canvasMod = await this.tryLoadCanvas();
    if (!canvasMod) return Buffer.alloc(0);

    try {
      return await this.drawCard(canvasMod, data);
    } catch (renderErr) {
      log.error('Canvas render error', { err: String(renderErr) });
      return Buffer.alloc(0);
    }
  }

  private async drawCard(canvasMod: CanvasModule, data: ProfileCardData): Promise<Buffer> {
    const createCanvas = canvasMod['createCanvas'] as (w: number, h: number) => Canvas2DContext;
    const loadImage = canvasMod['loadImage'] as (src: string) => Promise<Canvas2DContext>;

    const WIDTH = 800;
    const HEIGHT = 500;
    const canvas = createCanvas(WIDTH, HEIGHT) as Canvas2DContext;
    const ctx = (canvas['getContext'] as (t: string) => Canvas2DContext)('2d');

    // ── Background ──────────────────────────────────────────────────────────
    const gradient = (ctx['createLinearGradient'] as (x0: number, y0: number, x1: number, y1: number) => Canvas2DContext)(0, 0, WIDTH, HEIGHT);
    (gradient['addColorStop'] as (offset: number, color: string) => void)(0, '#0f0c29');
    (gradient['addColorStop'] as (offset: number, color: string) => void)(0.5, '#302b63');
    (gradient['addColorStop'] as (offset: number, color: string) => void)(1, '#24243e');
    ctx['fillStyle'] = gradient;
    (ctx['fillRect'] as (x: number, y: number, w: number, h: number) => void)(0, 0, WIDTH, HEIGHT);

    // ── Border glow ─────────────────────────────────────────────────────────
    ctx['strokeStyle'] = '#ffd700';
    ctx['lineWidth'] = 3;
    (ctx['strokeRect'] as (x: number, y: number, w: number, h: number) => void)(4, 4, WIDTH - 8, HEIGHT - 8);

    // ── Avatar placeholder ───────────────────────────────────────────────────
    const AVATAR_X = 40;
    const AVATAR_Y = 40;
    const AVATAR_SIZE = 120;

    ctx['fillStyle'] = '#4b4b80';
    (ctx['fillRect'] as (x: number, y: number, w: number, h: number) => void)(AVATAR_X, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE);

    if (data.avatarUrl) {
      try {
        const img = await loadImage(data.avatarUrl);
        (ctx['save'] as () => void)();
        (ctx['beginPath'] as () => void)();
        (ctx['roundRect'] as (x: number, y: number, w: number, h: number, r: number) => void)(AVATAR_X, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE, 12);
        (ctx['clip'] as () => void)();
        (ctx['drawImage'] as (img: Canvas2DContext, x: number, y: number, w: number, h: number) => void)(img, AVATAR_X, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE);
        (ctx['restore'] as () => void)();
      } catch {
        // Avatar load failed — keep the placeholder
      }
    }

    // Avatar border
    ctx['strokeStyle'] = '#ffd700';
    ctx['lineWidth'] = 2;
    (ctx['strokeRect'] as (x: number, y: number, w: number, h: number) => void)(AVATAR_X, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE);

    // Level badge
    ctx['fillStyle'] = '#ffd700';
    (ctx['fillRect'] as (x: number, y: number, w: number, h: number) => void)(AVATAR_X, AVATAR_Y + AVATAR_SIZE - 28, AVATAR_SIZE, 28);
    ctx['fillStyle'] = '#000000';
    ctx['font'] = 'bold 14px sans-serif';
    ctx['textAlign'] = 'center';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(`Lv. ${data.level}`, AVATAR_X + AVATAR_SIZE / 2, AVATAR_Y + AVATAR_SIZE - 9);

    // ── Name & class ────────────────────────────────────────────────────────
    ctx['textAlign'] = 'left';
    ctx['fillStyle'] = '#ffffff';
    ctx['font'] = 'bold 28px sans-serif';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(data.username, 185, 75);

    ctx['fillStyle'] = '#aaaaff';
    ctx['font'] = '18px sans-serif';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(`${data.classEmoji} ${data.className}`, 185, 105);

    if (data.prestigeLevel > 0) {
      ctx['fillStyle'] = '#ffd700';
      ctx['font'] = '14px sans-serif';
      (ctx['fillText'] as (text: string, x: number, y: number) => void)(`✨ Prestige ${data.prestigeLevel}`, 185, 130);
    }

    // Power rating
    ctx['fillStyle'] = '#ffd700';
    ctx['font'] = 'bold 22px sans-serif';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(`⚡ ${formatNumber(data.powerRating)} PR`, 185, 160);
    ctx['fillStyle'] = '#aaaaff';
    ctx['font'] = '14px sans-serif';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(`Rank: ${data.powerRatingLabel}`, 185, 182);

    // ── HP / Mana / XP bars ───────────────────────────────────────────────────
    this.drawBar(ctx, 185, 205, 560, 18, data.stats.hp, data.stats.maxHp, '#ff4444', '#880000', '❤️ HP');
    this.drawBar(ctx, 185, 240, 560, 18, data.stats.mp, data.stats.maxMp, '#4488ff', '#003388', '💧 MP');
    this.drawBar(ctx, 185, 275, 560, 14, data.experience, data.experienceToNextLevel, '#44ff88', '#006644', '⭐ XP');

    // ── Stats grid ───────────────────────────────────────────────────────────
    const statsY = 320;
    const statsCols: Array<{ label: string; value: number | string }> = [
      { label: '⚔️ ATK', value: data.stats.attack },
      { label: '🛡️ DEF', value: data.stats.defense },
      { label: '✨ MATK', value: data.stats.magicAttack },
      { label: '🔮 MDEF', value: data.stats.magicDefense },
      { label: '⚡ SPD', value: data.stats.speed },
      { label: '🍀 LCK', value: data.stats.luck },
      { label: '🎯 CRIT', value: `${data.stats.critRate}%` },
      { label: '💥 CDmg', value: `${data.stats.critDamage}%` },
    ];

    const colWidth = 98;
    statsCols.forEach((stat, i) => {
      const x = 40 + i * colWidth;
      ctx['fillStyle'] = 'rgba(255,255,255,0.08)';
      (ctx['fillRect'] as (x: number, y: number, w: number, h: number) => void)(x, statsY, colWidth - 6, 55);
      ctx['strokeStyle'] = 'rgba(255,255,255,0.15)';
      ctx['lineWidth'] = 1;
      (ctx['strokeRect'] as (x: number, y: number, w: number, h: number) => void)(x, statsY, colWidth - 6, 55);

      ctx['fillStyle'] = '#aaaaff';
      ctx['font'] = '11px sans-serif';
      ctx['textAlign'] = 'center';
      (ctx['fillText'] as (text: string, x: number, y: number) => void)(stat.label, x + (colWidth - 6) / 2, statsY + 16);

      ctx['fillStyle'] = '#ffffff';
      ctx['font'] = 'bold 16px sans-serif';
      (ctx['fillText'] as (text: string, x: number, y: number) => void)(String(stat.value), x + (colWidth - 6) / 2, statsY + 38);
    });

    // ── Currency ─────────────────────────────────────────────────────────────
    ctx['textAlign'] = 'left';
    ctx['fillStyle'] = '#ffd700';
    ctx['font'] = 'bold 16px sans-serif';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(`💰 ${formatNumber(data.gold)} Gold`, 40, HEIGHT - 35);
    ctx['fillStyle'] = '#44aaff';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(`💎 ${formatNumber(data.gems)} Gems`, 260, HEIGHT - 35);

    ctx['fillStyle'] = '#aaaaaa';
    ctx['font'] = '12px sans-serif';
    ctx['textAlign'] = 'right';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(`Battles: ${data.battlesWon}W / ${data.battlesLost}L`, WIDTH - 20, HEIGHT - 20);

    return (canvas['toBuffer'] as (format: string) => Buffer)('image/png');
  }

  private drawBar(
    ctx: Canvas2DContext,
    x: number,
    y: number,
    width: number,
    height: number,
    current: number,
    max: number,
    fillColor: string,
    bgColor: string,
    label: string,
  ): void {
    const ratio = max > 0 ? Math.min(current / max, 1) : 0;

    ctx['fillStyle'] = bgColor;
    (ctx['fillRect'] as (x: number, y: number, w: number, h: number) => void)(x, y, width, height);

    ctx['fillStyle'] = fillColor;
    (ctx['fillRect'] as (x: number, y: number, w: number, h: number) => void)(x, y, Math.round(width * ratio), height);

    ctx['fillStyle'] = '#ffffff';
    ctx['font'] = `bold ${height - 2}px sans-serif`;
    ctx['textAlign'] = 'left';
    (ctx['fillText'] as (text: string, x: number, y: number) => void)(
      `${label}  ${formatNumber(current)} / ${formatNumber(max)}`,
      x + 6,
      y + height - 3,
    );
  }
}
