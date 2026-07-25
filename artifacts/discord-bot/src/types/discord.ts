import type {
  ChatInputCommandInteraction,
  ButtonInteraction,
  SelectMenuInteraction,
  ModalSubmitInteraction,
  AutocompleteInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export interface SlashCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
  autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
}

export interface ButtonHandler {
  customId: string | RegExp;
  execute(interaction: ButtonInteraction): Promise<void>;
}

export interface SelectMenuHandler {
  customId: string | RegExp;
  execute(interaction: SelectMenuInteraction): Promise<void>;
}

export interface ModalHandler {
  customId: string | RegExp;
  execute(interaction: ModalSubmitInteraction): Promise<void>;
}

export interface AutocompleteHandler {
  commandName: string;
  execute(interaction: AutocompleteInteraction): Promise<void>;
}

/**
 * Custom ID format: {action}:{category}:{entityId}:{userId}:{extra}
 */
export interface ParsedCustomId {
  action: string;
  category: string;
  entityId: string;
  userId: string;
  extra: string;
}

export function parseCustomId(customId: string): ParsedCustomId {
  const [action = '', category = '', entityId = '', userId = '', extra = ''] =
    customId.split(':');
  return { action, category, entityId, userId, extra };
}
