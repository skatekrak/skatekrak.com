import httpStatus from 'http-status';
import { Document, Model, Types } from 'mongoose';

import APIError from '../helpers/api-error';
import logger from '../server/logger';
import mongoose from '../server/mongo';
import utils from './utils';

import Media, { IMedia } from './media';
import { IProfile } from './profile';
import { ISpot } from './spot';
import Trick, { BodyVarial, Grabs, ITrick, OneFooted, Shifty, Terrains, TrickStances } from './trick';
import TrickWish from './trick-wish';

export interface ITrickDone extends Document {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    addedBy: string | IProfile;
    trick: string | ITrick;
    totalPoints: number;
    points: number;
    terrain: Terrains;
    stance: TrickStances;
    stanceBonus: number;
    spot: Types.ObjectId | ISpot;
    validated: boolean;
    grab: Grabs;
    bodyVarial: BodyVarial;
    shifty: Shifty;
    oneFooted: OneFooted;
}

export interface ITrickDoneModel extends Model<ITrickDone> {
    /**
     * Build a TrickDone
     */
    build(
        this: ITrickDoneModel,
        {
            trickId,
            addedBy,
            stance,
            terrain,
            spot,
            validated,
            shifty,
            oneFooted,
            bodyVarial,
            grab,
        }: {
            trickId: string;
            addedBy: string;
            stance?: TrickStances;
            terrain: Terrains;
            spot?: Types.ObjectId;
            validated?: boolean;
            shifty?: Shifty;
            oneFooted?: OneFooted;
            bodyVarial?: BodyVarial;
            grab?: Grabs;
        },
    ): Promise<ITrickDone>;
    /**
     * Get the trickDone
     */
    get(this: ITrickDoneModel, id: Types.ObjectId): Promise<ITrickDone>;
    /**
     * List trick dones in descending order of 'createdAt'
     */
    list(
        this: ITrickDoneModel,
        { limit, newer, older, query }: { limit?: number; newer?: Date; older?: Date; query?: any },
    ): Promise<ITrickDone[]>;
    /**
     * List medias which contains trick dones
     */
    listFromMedia(
        this: ITrickDoneModel,
        {
            limit,
            newer,
            older,
            query,
        }: {
            limit?: number;
            newer?: Date;
            older?: Date;
            query?: any;
        },
    ): Promise<IMedia[]>;
    /**
     * Query trickDone
     */
    query(this: ITrickDoneModel, { from, to, query }: { from?: Date; to?: Date; query?: any }): Promise<ITrickDone[]>;
    /**
     * Count how many users did a trick
     */
    uniqAddedBy(this: ITrickDoneModel, trick: string): Promise<number>;
    /**
     * Update all tricks-done from oriId spot to destId spot
     */
    updateAllSpot(this: ITrickDoneModel, oriId: Types.ObjectId, destId: Types.ObjectId): Promise<any>;
}

export const TrickDoneSchema = new mongoose.Schema<ITrickDone>(
    {
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
            default: 'trick-done',
        },
        addedBy: {
            type: String,
            ref: 'Profile',
            index: true,
        },
        trick: {
            type: String,
            ref: 'Trick',
            required: true,
            index: true,
        },
        totalPoints: {
            type: Number,
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        terrain: {
            type: String,
            enum: Object.values(Terrains),
            required: true,
        },
        stance: {
            type: String,
            enum: Object.values(TrickStances),
            required: true,
            default: TrickStances.Regular,
        },
        stanceBonus: {
            type: Number,
            default: 1.0,
        },
        spot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spot',
            index: true,
        },
        validated: {
            type: Boolean,
            default: false,
            index: true,
        },
        grab: {
            type: String,
            enum: Object.values(Grabs),
        },
        bodyVarial: {
            type: String,
            enum: Object.values(BodyVarial),
        },
        shifty: {
            type: String,
            enum: Object.values(Shifty),
        },
        oneFooted: {
            type: String,
            enum: Object.values(OneFooted),
        },
    },
    utils.genSchemaConf((_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }),
);

TrickDoneSchema.pre('validate', function(this: ITrickDone, next) {
    // Calculate the total points before saving
    this.totalPoints = this.points * this.stanceBonus;
    next();
});

TrickDoneSchema.post('save', async (trickDone: ITrickDone) => {
    logger.debug('Trigger post save', trickDone);
    try {
        const addedById = typeof trickDone.addedBy === 'string' ? trickDone.addedBy : trickDone.addedBy.id;
        // Let's check if there is a TrickWish for this trick
        await TrickWish.incrementIfExist(addedById, {
            trick: trickDone.trick as string,
            stance: trickDone.stance,
            terrain: trickDone.terrain,
        });
    } catch (err) {
        logger.error(err);
    }
});

TrickDoneSchema.statics = {
    build(
        this: ITrickDoneModel,
        {
            trickId,
            addedBy,
            stance = TrickStances.Regular,
            terrain,
            spot,
            validated = false,
            shifty,
            oneFooted,
            bodyVarial,
            grab,
        }: {
            trickId: string;
            addedBy: string;
            stance?: TrickStances;
            terrain: Terrains;
            spot?: Types.ObjectId;
            validated?: boolean;
            shifty?: Shifty;
            oneFooted?: OneFooted;
            bodyVarial?: BodyVarial;
            grab?: Grabs;
        },
    ): Promise<ITrickDone> {
        return Trick.get(trickId).then((trick) => {
            const trickDone = new this({
                stance,
                spot,
                terrain,
                validated,
                shifty,
                oneFooted,
                bodyVarial,
                grab,
                addedBy,
                trick: trick._id,
                points: trick.points,
                stanceBonus: 1,
            });

            return trickDone;
        });
    },
    async get(this: ITrickDoneModel, id: Types.ObjectId): Promise<ITrickDone> {
        const trickDone = await this.findById(id)
            .populate('addedBy', 'profilePicture')
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .populate('trick', 'name')
            .exec();
        if (trickDone) {
            return trickDone;
        }
        throw new APIError(['No such TrickDone exists'], httpStatus.NOT_FOUND);
    },
    list(
        this: ITrickDoneModel,
        {
            limit = 20,
            newer,
            older = new Date(),
            query = {},
        }: { limit?: number; newer?: Date; older?: Date; query?: any },
    ): Promise<ITrickDone[]> {
        const q = this.find(query)
            .populate('addedBy', 'profilePicture')
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .populate('trick', 'name')
            .sort('-createdAt')
            .limit(limit);
        if (newer) {
            q.where('createdAt').gt(newer.getTime());
        } else {
            q.where('createdAt').lt(older.getTime());
        }
        return q.exec();
    },
    listFromMedia({
        limit = 20,
        newer,
        older = new Date(),
        query = {},
    }: {
        limit?: number;
        newer?: Date;
        older?: Date;
        query?: any;
    }): Promise<IMedia[]> {
        const q = Media.find(Object.assign({ trickDone: { $exists: true } }, query))
            .populate('trickDone.trick', 'name')
            .sort('-createdAt')
            .limit(limit);
        if (newer) {
            q.where('createdAt').gt(newer.getTime());
        } else {
            q.where('createdAt').lt(older.getTime());
        }
        return q.exec();
    },
    query(
        this: ITrickDoneModel,
        { from, to, query = {} }: { from?: Date; to?: Date; query?: any },
    ): Promise<ITrickDone[]> {
        const q = this.find(query).sort('-createdAt');
        if (from) {
            q.where('createdAt').gt(from.getTime());
        }
        if (to) {
            q.where('createdAt').lt(to.getTime());
        }
        return q.exec();
    },
    uniqAddedBy(this: ITrickDoneModel, trick: string): Promise<number> {
        return this.find()
            .where('trick')
            .equals(trick)
            .exec()
            .then((tricksDone) => {
                const addedBySet = new Set();
                tricksDone.forEach((trickDone) => addedBySet.add(trickDone.addedBy));
                const length = addedBySet.size;
                logger.debug('length', length);
                return length;
            });
    },
    updateAllSpot(this: ITrickDoneModel, oriId: Types.ObjectId, destId: Types.ObjectId): Promise<any> {
        return this.updateMany({ spot: oriId }, { spot: destId }).exec();
    },
};

export const TrickDone = mongoose.model<ITrickDone, ITrickDoneModel>('TrickDone', TrickDoneSchema);

export default TrickDone;
