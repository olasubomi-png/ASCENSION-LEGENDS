import type { IUserSchema } from '../models/index.js';
import { UserModel } from '../models/index.js';
import type { PaginatedResult } from '../types/common.js';

export type CreateUserData = Pick<IUserSchema, '_id' | 'discordId' | 'username' | 'discriminator'> & {
  email?: string | undefined;
  deletedAt?: Date | undefined;
};

export class UserRepository {
  async findById(id: string): Promise<IUserSchema | null> {
    return UserModel.findOne({ _id: id, deletedAt: null }).lean().exec() as Promise<IUserSchema | null>;
  }

  async findByDiscordId(discordId: string): Promise<IUserSchema | null> {
    return UserModel.findOne({ discordId, deletedAt: null }).lean().exec() as Promise<IUserSchema | null>;
  }

  async findMany(
    filter: Partial<IUserSchema> = {},
    limit = 20,
    cursor?: string,
  ): Promise<PaginatedResult<IUserSchema>> {
    const query: Record<string, unknown> = { ...filter, deletedAt: null };
    if (cursor) query['_id'] = { $gt: cursor };

    const items = await UserModel.find(query)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean()
      .exec() as IUserSchema[];

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const lastItem = data.at(-1);

    return {
      items: data,
      cursor: hasMore ? lastItem?._id : undefined,
      hasMore,
    };
  }

  async create(data: CreateUserData): Promise<IUserSchema> {
    const user = new UserModel(data);
    const saved = await user.save();
    return saved.toObject() as IUserSchema;
  }

  async update(id: string, data: Partial<IUserSchema>): Promise<IUserSchema | null> {
    return UserModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: data },
      { new: true },
    ).lean().exec() as Promise<IUserSchema | null>;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
    return result.modifiedCount > 0;
  }
}
