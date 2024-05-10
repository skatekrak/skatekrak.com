import httpStatus from 'http-status';
import { Document, Model, Types } from 'mongoose';

import APIError from '../helpers/api-error';
import mongoose from '../server/mongo';
import utils from './utils';

import { CommentSchema, IComment } from './comment';
import { ILike, LikeSchema } from './like';
import { IProfile } from './profile';
import { ISpot } from './spot';
import Stat, { IStat, StatSchema, Timeframes } from './stat';

export enum Providers {
    Youtube = 'youtube',
    Vimeo = 'vimeo',
}

export interface IClip extends Document {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    title: string;
    description: string;
    provider: Providers;
    videoURL: string;
    thumbnailURL: string;
    spot: Types.ObjectId | ISpot;
    addedBy: string | IProfile;
    likesStat: IStat;
    likes: ILike[];
    commentsStat: IStat;
    comments: IComment[];
}

export interface IClipModel extends Model<IClip> {
    /**
     * Get clip
     */
    get(this: IClipModel, id: Types.ObjectId): Promise<IClip>;
    /**
     * List clips in descending order of 'createdAt'
     */
    list(this: IClipModel, limit?: number, newer?: Date, older?: Date, query?: any, selects?: string): Promise<IClip[]>;
    /**
     * Get most liked medias
     */
    mostLiked(this: IClipModel, limit?: number, timeframe?: Timeframes, query?: any): Promise<IClip[]>;
    /**
     * Update all clips from oriId spot to destId spot
     */
    updateAllSpot(this: IClipModel, oriId: Types.ObjectId, destId: Types.ObjectId): Promise<any>;
}

export const ClipSchema = new mongoose.Schema<IClip>(
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
            default: 'clip',
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        provider: {
            type: String,
            enum: Object.values(Providers),
            required: true,
            index: true,
        },
        videoURL: {
            type: String,
            required: true,
        },
        thumbnailURL: {
            type: String,
            required: true,
        },
        spot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spot',
            index: true,
        },
        addedBy: {
            type: String,
            ref: 'Profile',
            index: true,
        },
        likesStat: {
            type: StatSchema,
        },
        likes: [LikeSchema],
        commentsStat: StatSchema,
        comments: [CommentSchema],
    },
    utils.genSchemaConf((_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.likesCount;
        delete ret.commentsCount;
        return ret;
    }),
);

ClipSchema.pre('save', function(this: IClip, next) {
    this.likesStat = Stat.build(this.likes);
    this.commentsStat = Stat.build(this.comments);
    next();
});

ClipSchema.statics = {
    async get(this: IClipModel, id: Types.ObjectId): Promise<IClip> {
        const clip = await this.findById(id)
            .populate('addedBy', 'profilePicture')
            .populate('spot', 'name location type')
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .exec();
        if (clip) {
            return clip;
        }
        throw new APIError(['No such clip exists'], httpStatus.NOT_FOUND);
    },
    list(
        this: IClipModel,
        limit = 20,
        newer?: Date,
        older: Date = new Date(),
        query: any = {},
        selects = '',
    ): Promise<IClip[]> {
        const q = this.find(query)
            .select(selects)
            .populate('addedBy', 'profilePicture')
            .populate('spot', 'name location type')
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .sort('-createdAt')
            .limit(limit);
        if (newer) {
            q.where('createdAt').gt(newer.getTime());
        } else {
            q.where('createdAt').lt(older.getTime());
        }
        return q.exec();
    },
    mostLiked(this: IClipModel, limit = 20, timeframe: Timeframes = Timeframes.All, query: any = {}): Promise<IClip[]> {
        const q = this.find(query)
            .populate('addedBy', 'profilePicture')
            .populate('spot', 'name location type')
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .limit(limit);
        Stat.createQuery(q, 'likesStat', timeframe);
        return q.exec();
    },
    updateAllSpot(this: IClipModel, oriId: Types.ObjectId, destId: Types.ObjectId): Promise<any> {
        return this.updateMany({ spot: oriId }, { spot: destId }).exec();
    },
};

export const Clip = mongoose.model<IClip, IClipModel>('Clip', ClipSchema);

export default Clip;
