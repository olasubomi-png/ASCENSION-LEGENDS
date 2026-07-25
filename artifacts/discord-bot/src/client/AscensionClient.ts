import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} from 'discord.js';

import type {
  SlashCommand,
  ButtonHandler,
  SelectMenuHandler,
  ModalHandler,
  AutocompleteHandler,
} from '../types/discord.js';

export class AscensionClient extends Client {
  public readonly commands = new Collection<string, SlashCommand>();
  public readonly buttons = new Collection<string | RegExp, ButtonHandler>();
  public readonly selectMenus = new Collection<string | RegExp, SelectMenuHandler>();
  public readonly modals = new Collection<string | RegExp, ModalHandler>();
  public readonly autocomplete = new Collection<string, AutocompleteHandler>();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.User],
      allowedMentions: { parse: ['users'], repliedUser: false },
    });
  }
}
