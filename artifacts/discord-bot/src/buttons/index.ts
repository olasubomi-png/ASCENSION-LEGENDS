/**
 * Button handlers are registered here and loaded by the client.
 * Each handler implements the ButtonHandler interface from types/discord.ts.
 *
 * Custom ID format: {action}:{category}:{entityId}:{userId}:{extra}
 *
 * Example handler file:
 *   export default {
 *     customId: /^confirm:delete:/,
 *     async execute(interaction) { ... }
 *   } satisfies ButtonHandler;
 */
