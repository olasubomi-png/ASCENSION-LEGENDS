import type { IGuildSchema } from '../models/index.js';
import { GuildModel } from '../models/index.js';

export type CreateGuildData = Pick<IGuildSchema, '_id' | 'discordGuildId' | 'name' | 'ownerId' | 'memberCount'> & {
  deletedAt?: Date | undefined;
};

export class GuildRepository {
  async findByDiscordGuildId(discordGuildId: string): Promise<IGuildSchema | null> {
    return GuildModel.findOne({ discordGuildId, deletedAt: null })
      .lean()
      .exec() as Promise<IGuildSchema | null>;
  }

  async create(data: CreateGuildData): Promise<IGuildSchema> {
    const guild = new GuildModel(data);
    const saved = await guild.save();
    return saved.toObject() as IGuildSchema;
  }

  async update(id: string, data: Partial<IGuildSchema>): Promise<IGuildSchema | null> {
    return GuildModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: data },
      { new: true },
    ).lean().exec() as Promise<IGuildSchema | null>;
  }
}
