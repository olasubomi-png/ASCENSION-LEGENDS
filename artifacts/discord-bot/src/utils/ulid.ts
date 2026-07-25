import { ulid } from 'ulid';

import type { ID_PREFIXES } from '../constants/index.js';

type Prefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES];

/** Generate a raw ULID string. */
export function generateId(): string {
  return ulid();
}

/** Generate a ULID with an entity-type prefix (e.g. "user_01J…"). */
export function generateIdWithPrefix(prefix: Prefix): string {
  return `${prefix}${ulid()}`;
}
