import type { ICharacterSchema } from '../models/CharacterModel.js';
import { CharacterModel } from '../models/CharacterModel.js';

export type CreateCharacterData = Omit<ICharacterSchema, 'createdAt' | 'updatedAt'>;

export class CharacterRepository {
  async findById(id: string): Promise<ICharacterSchema | null> {
    return CharacterModel.findOne({ _id: id }).lean().exec() as Promise<ICharacterSchema | null>;
  }

  async findActiveByDiscordId(discordId: string): Promise<ICharacterSchema | null> {
    return CharacterModel.findOne({ discordId, isActive: true })
      .lean()
      .exec() as Promise<ICharacterSchema | null>;
  }

  async findByUserId(userId: string): Promise<ICharacterSchema[]> {
    return CharacterModel.find({ userId }).lean().exec() as Promise<ICharacterSchema[]>;
  }

  async existsByDiscordId(discordId: string): Promise<boolean> {
    const count = await CharacterModel.countDocuments({ discordId });
    return count > 0;
  }

  async create(data: CreateCharacterData): Promise<ICharacterSchema> {
    const character = new CharacterModel(data);
    const saved = await character.save();
    return saved.toObject() as ICharacterSchema;
  }

  async update(id: string, data: Partial<ICharacterSchema>): Promise<ICharacterSchema | null> {
    return CharacterModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true },
    )
      .lean()
      .exec() as Promise<ICharacterSchema | null>;
  }
}
