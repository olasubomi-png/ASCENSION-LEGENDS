import { z } from 'zod';

/**
 * Profanity blocklist — basic set. Extend as needed.
 * Kept intentionally minimal; a production system should use a proper library.
 */
const PROFANITY_BLOCKLIST = [
  'admin',
  'moderator',
  'staff',
  'ascension',
  'fuck',
  'shit',
  'ass',
  'bitch',
  'bastard',
  'cunt',
  'dick',
  'pussy',
  'nigger',
  'nigga',
  'faggot',
  'retard',
];

function containsProfanity(name: string): boolean {
  const lower = name.toLowerCase();
  return PROFANITY_BLOCKLIST.some((word) => lower.includes(word));
}

/**
 * Character name validator.
 *
 * Rules (Book 2 / Sprint 2 spec):
 *  - 3–16 characters
 *  - Unicode letters, numbers, spaces, hyphens, underscores (no control characters)
 *  - No leading/trailing whitespace after trim
 *  - No profanity
 */
export const characterNameSchema = z
  .string()
  .trim()
  .min(3, 'Character name must be at least 3 characters.')
  .max(16, 'Character name cannot exceed 16 characters.')
  .regex(
    /^[\p{L}\p{N} _-]+$/u,
    'Character name may only contain letters, numbers, spaces, hyphens, and underscores.',
  )
  .refine((name) => !containsProfanity(name), {
    message: 'Character name contains disallowed words.',
  });

export const characterValidator = {
  name: characterNameSchema,
};
