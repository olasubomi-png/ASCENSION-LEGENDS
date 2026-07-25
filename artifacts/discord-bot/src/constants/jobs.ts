/** BullMQ queue names */
export const QUEUE_NAMES = {
  RENDER: 'render',
  BATTLE: 'battle',
  NOTIFICATION: 'notification',
  ECONOMY: 'economy',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

/** Job names per queue */
export const JOB_NAMES = {
  RENDER_BATTLE_GIF: 'render:battle-gif',
  RENDER_PROFILE_CARD: 'render:profile-card',
  PROCESS_BATTLE: 'battle:process',
  SEND_NOTIFICATION: 'notification:send',
  PROCESS_ECONOMY_TX: 'economy:process-tx',
} as const;
