import httpStatus from 'http-status';
import twitterText from 'twitter-text';

import { Document, Model, Types as MongoTypes } from 'mongoose';

import APIError from '../helpers/api-error';
import '../helpers/replace-all';
import mongoose from '../server/mongo';
import utils from './utils';
import { extractHashtags } from '../helpers/hashtags';

import { CloudinaryFileSchema, ICloudinaryFile } from './cloudinary-file';
import { CommentSchema, IComment } from './comment';
import { ILike, LikeSchema } from './like';
import { IProfile } from './profile';
import { ISpot } from './spot';
import Stat, { IStat, StatSchema, Timeframes } from './stat';
import { TrickDoneSchema } from './trick-done';

export enum Types {
    Image = 'image',
    Video = 'video',
}

export interface IMedia extends Document {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    _caption: string;
    type: Types;
    spot: MongoTypes.ObjectId | ISpot;
    addedBy: string | IProfile;
    image: ICloudinaryFile;
    video: ICloudinaryFile;
    staffPicked: boolean;
    releaseDate: Date;
    hashtags: string[];
    usertags: string[];
    likesStat: IStat;
    likes: ILike[];
    commentsStat: IStat;
    comments: IComment[];
    trickDone: any;

    /**
     * Extract Hashtags & Usertags from media
     */
    extractHashtagsMentions(this: IMedia): void;
}

export interface IMediaModel extends Model<IMedia> {
    /**
     * Get media
     */
    get(this: IMediaModel, id: MongoTypes.ObjectId): Promise<IMedia>;
    /**
     * List medias in descending order of 'createdAt'
     */
    list(
        this: IMediaModel,
        {
            limit,
            newer,
            older,
            query,
            selects,
            released,
        }: { limit?: number; newer?: Date; older?: Date; query?: any; selects?: string; released?: boolean },
    ): Promise<IMedia[]>;
    /**
     * Get most liked medias
     */
    mostLiked(this: IMediaModel, limit?: number, timeframe?: Timeframes, query?: any): Promise<IMedia[]>;
    /**
     * Count media with a given tag
     */
    countByHashtag(this: IMediaModel, tag: string): Promise<number>;
    /**
     * Update all medias from oriId spot to destId spot
     */
    updateAllSpot(this: IMediaModel, oriId: MongoTypes.ObjectId, destId: MongoTypes.ObjectId): Promise<any>;
    /**
     * Search Media
     */
    search(this: IMediaModel, query: string, limit?: number): Promise<IMedia[]>;
    /**
     * Query trickDone
     */
    query(this: IMediaModel, { from, to, query }: { from?: Date; to?: Date; query?: any }): Promise<IMedia[]>;
}

export const MediaSchema = new mongoose.Schema<IMedia>(
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
            default: 'media',
        },
        _caption: String,
        type: {
            type: String,
            enum: Object.values(Types),
            index: true,
        },
        spot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spot',
            index: true,
        },
        addedBy: {
            type: String,
            ref: 'Profile',
            required: true,
            index: true,
        },
        image: CloudinaryFileSchema,
        video: CloudinaryFileSchema,
        staffPicked: {
            type: Boolean,
            default: false,
            index: true,
        },
        releaseDate: {
            type: Date,
            index: true,
        },
        hashtags: {
            type: [String],
            index: true,
        },
        usertags: {
            type: [String],
            index: true,
        },
        likesStat: StatSchema,
        likes: [LikeSchema],
        commentsStat: StatSchema,
        comments: [CommentSchema],
        trickDone: TrickDoneSchema,
    },
    utils.genSchemaConf((_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret._caption;
        delete ret.__parse_id;
        delete ret.__old_photo_url;
        delete ret.__old_video_url;
        return ret;
    }),
);

MediaSchema.index(
    {
        _caption: 'text',
        hashtags: 'text',
        addedBy: 'text',
        usertags: 'text',
    },
    {
        name: 'media_index_text',
        weights: {
            _caption: 10,
            hashtags: 8,
            addedBy: 6,
            usertags: 4,
        },
    },
);

MediaSchema.pre('save', function(this: IMedia, next) {
    this.likesStat = Stat.build(this.likes);
    this.commentsStat = Stat.build(this.comments);
    next();
});

MediaSchema.virtual('caption').get(function(this: IMedia) {
    if (!this._caption) {
        return undefined;
    }
    let caption = this._caption.repeat(1);
    for (let i = 0; i < this.usertags.length; i += 1) {
        const handle = this.usertags[i];
        caption = caption.replaceAll(`{{${i}}}`, `@${handle}`);
    }
    return caption;
});

MediaSchema.statics = {
    async get(this: IMediaModel, id: MongoTypes.ObjectId): Promise<IMedia> {
        const media = await this.findById(id)
            .populate('addedBy', 'profilePicture')
            .populate('spot', 'name')
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .populate('trickDone.trick', 'name')
            .exec();
        if (media) {
            return media;
        }
        throw new APIError(['No such media exists'], httpStatus.NOT_FOUND);
    },
    list(
        this: IMediaModel,
        {
            limit = 20,
            newer,
            older = new Date(),
            query = {},
            selects = '',
            released = false,
        }: { limit?: number; newer?: Date; older?: Date; query?: any; selects?: string; released?: boolean },
    ): Promise<IMedia[]> {
        const q = this.find({
            $or: [{ image: { $exists: true, $ne: null } }, { video: { $exists: true, $ne: null } }],
        })
            .select(selects)
            .populate('addedBy', 'profilePicture')
            .populate('spot', { name: true, location: true, geo: true, type: true, status: true })
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .populate('trickDone.trick', 'name')
            .sort(newer ? 'createdAt' : '-createdAt')
            .limit(limit);
        if (released) {
            q.where('releaseDate').gt(new Date().getTime());
        } else {
            q.and([
                query,
                { $or: [{ releaseDate: { $exists: false } }, { releaseDate: { $lt: new Date().getTime() } }] },
            ]);
        }
        if (newer) {
            q.where('createdAt').gt(newer.getTime());
        } else {
            q.where('createdAt').lt(older.getTime());
        }
        return q.exec();
    },
    mostLiked(
        this: IMediaModel,
        limit = 20,
        timeframe: Timeframes = Timeframes.All,
        query: any = {},
    ): Promise<IMedia[]> {
        const q = this.find(query)
            .populate('addedBy', 'profilePicture')
            .populate('spot', 'name')
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .populate('trickDone.trick', 'name')
            .limit(limit);
        Stat.createQuery(q, 'likesStat', timeframe);
        return q.exec();
    },
    countByHashtag(this: IMediaModel, tag: string): Promise<number> {
        return this.find()
            .where({ hashtags: tag })
            .countDocuments()
            .exec();
    },
    updateAllSpot(this: IMediaModel, oriId: MongoTypes.ObjectId, destId: MongoTypes.ObjectId): Promise<any> {
        return this.updateMany({ spot: oriId }, { spot: destId }).exec();
    },
    search(this: IMediaModel, query: string, limit = 20): Promise<IMedia[]> {
        return this.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .exec();
    },
    query(this: IMediaModel, { from, to, query = {} }: { from?: Date; to?: Date; query?: any }): Promise<IMedia[]> {
        const q = this.find(query).sort('-createdAt');
        if (from) {
            q.where('createdAt').gt(from.getTime());
        }
        if (to) {
            q.where('createdAt').lt(to.getTime());
        }
        return q.exec();
    },
};

MediaSchema.methods = {
    extractHashtagsMentions(this: IMedia): void {
        this.usertags = [...new Set(twitterText.extractMentions(this._caption))];
        this.hashtags = [...new Set(extractHashtags(this._caption))];
        for (let i = 0; i < this.usertags.length; i += 1) {
            const handle = this.usertags[i];
            this._caption = this._caption.replace(`@${handle}`, `{{${i}}}`);
        }
    },
};

export const Media = mongoose.model<IMedia, IMediaModel>('Media', MediaSchema);

export default Media;
