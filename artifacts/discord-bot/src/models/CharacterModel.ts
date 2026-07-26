import mongoose, { Schema } from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

export interface ICharacterStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  magicAttack: number;
  magicDefense: number;
  speed: number;
  luck: number;
  critRate: number;
  critDamage: number;
  evasion: number;
  accuracy: number;
}

export interface ICharacterSchema {
  _id: string;
  characterId: string;
  userId: string;
  discordId: string;
  name: string;
  classId: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  stats: ICharacterStats;
  statPoints: number;
  skillPoints: number;
  locationId: string;
  zoneId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ICharacter = HydratedDocument<ICharacterSchema>;

const statsSchema = new Schema<ICharacterStats>(
  {
    hp: { type: Number, required: true },
    maxHp: { type: Number, required: true },
    mp: { type: Number, required: true },
    maxMp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    magicAttack: { type: Number, required: true },
    magicDefense: { type: Number, required: true },
    speed: { type: Number, required: true },
    luck: { type: Number, required: true },
    critRate: { type: Number, required: true },
    critDamage: { type: Number, required: true },
    evasion: { type: Number, required: true },
    accuracy: { type: Number, required: true },
  },
  { _id: false },
);

const characterSchema = new Schema<ICharacterSchema>(
  {
    _id: { type: String, required: true },
    characterId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    discordId: { type: String, required: true, index: true },
    name: { type: String, required: true, minlength: 2, maxlength: 24 },
    classId: { type: String, required: true },
    level: { type: Number, default: 1, min: 1, max: 100 },
    experience: { type: Number, default: 0 },
    experienceToNextLevel: { type: Number, default: 100 },
    stats: { type: statsSchema, required: true },
    statPoints: { type: Number, default: 0 },
    skillPoints: { type: Number, default: 0 },
    locationId: { type: String, default: 'starting_zone' },
    zoneId: { type: String, default: 'verdant_crossing' },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

characterSchema.index({ userId: 1, isActive: 1 });

export const CharacterModel: Model<ICharacterSchema> = mongoose.model<ICharacterSchema>(
  'Character',
  characterSchema,
  'characters',
);
