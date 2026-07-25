import { z } from 'zod';

export const playerValidator = {
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(32, 'Display name cannot exceed 32 characters')
    .regex(/^[a-zA-Z0-9 _-]+$/, 'Display name can only contain letters, numbers, spaces, _ and -'),

  discordId: z
    .string()
    .regex(/^\d{17,19}$/, 'Invalid Discord ID format'),
};
