import { parseCustomId } from '../../types/discord.js';

describe('parseCustomId', () => {
  it('parses a full custom ID', () => {
    const result = parseCustomId('attack:battle:btl_01J:user_01K:round1');
    expect(result).toEqual({
      action: 'attack',
      category: 'battle',
      entityId: 'btl_01J',
      userId: 'user_01K',
      extra: 'round1',
    });
  });

  it('fills missing segments with empty strings', () => {
    const result = parseCustomId('ping');
    expect(result).toEqual({
      action: 'ping',
      category: '',
      entityId: '',
      userId: '',
      extra: '',
    });
  });

  it('handles partial custom IDs', () => {
    const result = parseCustomId('confirm:delete');
    expect(result.action).toBe('confirm');
    expect(result.category).toBe('delete');
    expect(result.entityId).toBe('');
  });
});
