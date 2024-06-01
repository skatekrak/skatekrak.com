import httpStatus from 'http-status';
import { Document, Model } from 'mongoose';

import APIError from '../helpers/api-error';
import mongoose from '../server/mongo';
import utils from './utils';

export enum DifficultyLevels {
    Beginner = 'beginner',
    Intermediate = 'intermediate',
    Advanced = 'advanced',
    DaewonSong = 'daewon_song',
}

export enum Terrains {
    Flatground = 'flatground',
    GapStairs = 'gap_stairs',
    Bank = 'bank',
    Bump = 'bump',
    LedgeCurn = 'ledge_curb',
    Hubba = 'hubba',
    FlatRail = 'flatrail',
    HandRail = 'handrail',
    MiniRamp = 'miniramp',
    Bowl = 'bowl',
    Vert = 'vert',
    Spine = 'spine',
    Wall = 'wall',
    ManualPad = 'manual_pad',
    PoleJam = 'polejam',
    MegaRamp = 'megaramp',
}

export enum TrickStances {
    Regular = 'regular',
    Switch = 'switch',
    Fakie = 'fakie',
    Nollie = 'nollie',
}

export enum Shifty {
    Backside = 'backside',
    Frontside = 'frontside',
}

export enum OneFooted {
    North = 'north',
    South = 'south',
}

export enum BodyVarial {
    FrontSide = 'frontside',
    Backside = 'backside',
    FS360 = 'fs_360',
    BS360 = 'bs_360',
}

export enum Grabs {
    Indy = 'indy',
    Melon = 'melon',
    NodeGrab = 'nosegrab',
    TailGrab = 'tailgrab',
    Mute = 'mute',
    Stalefish = 'stalefish',
    Roastbeef = 'roastbeef',
    Canonball = 'canonball',
    Crailgrab = 'crailgrab',
}

export interface ITrick extends Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    className: string;
    name: string;
    hashtag: string;
    difficulty: number;
    difficultyLevel: DifficultyLevels;
    keywords: string[];
    points: number;
    order: number;
    pictureURL: string;

    /**
     * Get cover filename
     */
    getFilename(this: ITrick): string;
}

export interface ITrickModel extends Model<ITrick> {
    /**
     * Get trick
     */
    get(this: ITrickModel, id: string): Promise<ITrick>;
    /**
     * List trick in ascending order or 'order'
     */
    list(this: ITrickModel): Promise<ITrick[]>;
    /**
     * Search Trick
     */
    search(this: ITrickModel, query: string, limit?: number): Promise<ITrick[]>;
}

export const TrickSchema = new mongoose.Schema<ITrick>(
    {
        _id: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            index: true,
        },
        updatedAt: {
            type: Date,
            index: true,
        },
        className: {
            type: String,
            default: 'trick',
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        hashtag: {
            type: String,
            required: true,
            unique: true,
        },
        difficulty: {
            type: Number,
            default: 0,
        },
        difficultyLevel: {
            type: String,
            required: true,
            enum: Object.values(DifficultyLevels),
        },
        keywords: {
            type: [String],
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        order: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        pictureURL: String,
    },
    utils.genSchemaConf(),
);

TrickSchema.index(
    {
        name: 'text',
        keywords: 'text',
        difficultyLevel: 'text',
    },
    {
        name: 'trick_index_text',
        weights: {
            name: 10,
            keywords: 6,
            difficultyLevel: 4,
        },
    },
);

TrickSchema.methods = {
    getFilename(this: ITrick): string {
        return `${this.id}.png`;
    },
};

TrickSchema.statics = {
    async get(this: ITrickModel, id: string): Promise<ITrick> {
        const trick = await this.findById(id).exec();
        if (trick) {
            return trick;
        }
        throw new APIError(['No such trick exists'], httpStatus.NOT_FOUND);
    },
    list(this: ITrickModel): Promise<ITrick[]> {
        return this.find()
            .sort({ order: 1 })
            .exec();
    },
    search(this: ITrickModel, query: string, limit = 20): Promise<ITrick[]> {
        return this.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .exec();
    },
};

export const Trick = mongoose.model<ITrick, ITrickModel>('Trick', TrickSchema);

export default Trick;
