/**
 * Jest global setup — inject required env vars before any module is loaded.
 * This prevents config/env.ts from throwing during test runs.
 */

process.env['NODE_ENV'] = 'test';
process.env['DISCORD_TOKEN'] = 'test-token-placeholder';
process.env['DISCORD_CLIENT_ID'] = '000000000000000000';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/ascension-test';
