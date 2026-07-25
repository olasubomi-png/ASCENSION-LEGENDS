import { z } from 'zod';

export const economyValidator = {
  amount: z
    .number()
    .int('Amount must be an integer')
    .positive('Amount must be positive')
    .max(1_000_000, 'Amount exceeds maximum single transaction'),

  currency: z.enum(['gold', 'gems']),
};
