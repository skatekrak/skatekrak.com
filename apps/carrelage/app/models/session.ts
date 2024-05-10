import httpStatus from 'http-status';
import { Document, Model, Types } from 'mongoose';
import twitterText from 'twitter-text';

import APIError from '../helpers/api-error';
import '../helpers/replace-all';
import mongoose from '../server/mongo';
import utils from './utils';

import { CommentSchema, IComment } from './comment';
import { ILike, LikeSchema } from './like';
import { IProfile } from './profile';
import { ISpot } from './spot';
import Stat, { IStat, StatSchema } from './stat';

export interface ISession extends Document {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    _caption: string;
    addedBy: string | IProfile;
    with: string[] | IProfile[];
    coverURL: string;
    spots: Types.ObjectId[] | ISpot[];
    when: Date;
    hashtags: string[];
    usertags: string[];
    likesStat: IStat;
    likes: ILike[];
    commentsStat: IStat;
    comments: IComment[];

    /**
     * Get cover filename
     */
    getFilename(): string;
    /**
     * Extract hashtags and usertages from caption
     */
    extractHashtagsMentions(): void;
}

export interface ISessionModel extends Model<ISession> {
    /**
     * Get session
     */
    get(this: ISessionModel, id: Types.ObjectId): Promise<ISession>;
    /**
     * List sessions in descending order of 'createAt'
     */
    list(
        this: ISessionModel,
        limit?: number,
        newer?: Date,
        older?: Date,
        query?: any,
        selects?: string,
    ): Promise<ISession[]>;
    /**
     * Count sessions added or with id
     */
    countWithBy(this: ISessionModel, id: string): Promise<number>;
    /**
     * Count spots skated by id
     */
    countSkatedBy(this: ISessionModel, id: string): Promise<number>;
    /**
     * List profiles of who skate here
     */
    whoSkateHere(
        this: ISessionModel,
        spotId: Types.ObjectId,
        limit?: number,
        newer?: Date,
        older?: Date,
    ): Promise<IProfile[]>;
    /**
     * Get spots skated by id
     */
    skatedBy(this: ISessionModel, id: string): Promise<ISession[]>;
    /**
     * Update all spots following from oriId spot to destId spot
     */
    updateAllSpot(this: ISessionModel, oriId: Types.ObjectId, destId: Types.ObjectId): Promise<any>;
}

export const SessionSchema = new mongoose.Schema<ISession>(
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
            default: 'session',
        },
        _caption: String,
        addedBy: {
            type: String,
            ref: 'Profile',
            required: true,
            index: true,
        },
        with: {
            type: [{ type: String, ref: 'Profile' }],
            index: true,
        },
        coverURL: {
            type: String,
            match: [
                /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/,
                'The value of path {PATH} ({VALUE}) is not a valid URL.',
            ],
        },
        spots: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Spot' }],
            index: true,
        },
        when: {
            type: Date,
            default: new Date(),
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
    },
    utils.genSchemaConf((_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret._caption;
        return ret;
    }),
);

SessionSchema.pre('save', function(this: ISession, next) {
    this.likesStat = Stat.build(this.likes);
    this.commentsStat = Stat.build(this.comments);
    next();
});

SessionSchema.virtual('caption').get(function(this: ISession) {
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

SessionSchema.methods = {
    getFilename(): string {
        return `${this.id}.png`;
    },
    extractHashtagsMentions(): void {
        this.usertags = [...new Set(twitterText.extractMentions(this._caption))];
        this.hashtags = [
            ...new Set(twitterText.extractHashtags(this._caption).map((hashtag) => `#${hashtag.toLowerCase()}`)),
        ];
        for (let i = 0; i < this.usertags.length; i += 1) {
            const handle = this.usertags[i];
            this._caption = this._caption.replace(`@${handle}`, `{{${i}}}`);
        }
    },
};

SessionSchema.statics = {
    /**
     * Get session
     */
    async get(this: ISessionModel, id: Types.ObjectId): Promise<ISession> {
        const session = await this.findById(id)
            .populate('addedBy', 'profilePicture')
            .populate('spots', 'name location type')
            .populate('with', 'profilePicture')
            .populate('likes.addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .exec();
        if (session) {
            return session;
        }
        throw new APIError(['No such session exists'], httpStatus.NOT_FOUND);
    },
    /**
     * List sessions in descending order of 'createAt'
     */
    list(
        this: ISessionModel,
        limit = 20,
        newer?: Date,
        older?: Date,
        query: any = {},
        selects = '',
    ): Promise<ISession[]> {
        const q = this.find(query)
            .select(selects)
            .populate('addedBy', 'profilePicture')
            .populate('spots', 'name location type')
            .populate('with', 'profilePicture')
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
    /**
     * Count sessions added or with id
     */
    countWithBy(this: ISessionModel, id: string): Promise<number> {
        return this.find()
            .or([{ addedBy: id }, { with: id }])
            .countDocuments()
            .exec();
    },
    /**
     * Count spots skated by id
     */
    countSkatedBy(this: ISessionModel, id: string): Promise<number> {
        return this.find()
            .or([{ addedBy: id }, { with: id }])
            .exec()
            .then((sessions) => sessions.map((session) => session.spots))
            .then((spots) => new Set([].concat(...spots)).size);
    },
    /**
     * List profiles of who skate here
     */
    whoSkateHere(
        this: ISessionModel,
        spotId: Types.ObjectId,
        limit = 20,
        newer?: Date,
        older?: Date,
    ): Promise<IProfile[]> {
        const query = this.find()
            .where('spots')
            .equals(spotId)
            .populate('addedBy', 'profilePicture')
            .populate('with', 'profilePicture')
            .sort('-createdAt')
            .limit(limit);
        if (newer) {
            query.where('createdAt').gt(newer.getTime());
        } else {
            query.where('createdAt').lt(older.getTime());
        }
        return query.exec().then((sessions) => {
            const map = new Map<string, number>();
            const profilesMap = new Map<string, IProfile>();

            sessions.forEach((session) => {
                const addedBy = session.addedBy as IProfile;
                const count = map.has(addedBy.id) ? map.get(addedBy.id) + 1 : 1;
                map.set(addedBy.id, count);
                profilesMap.set(addedBy.id, addedBy);

                (session.with as IProfile[]).forEach((skater) => {
                    const subCount = map.has(skater.id) ? map.get(skater.id) + 1 : 1;
                    map.set(skater.id, subCount);
                    profilesMap.set(skater.id, skater);
                });
            });
            const res = [...map.keys()];

            return res.map((id) => {
                const profile = profilesMap.get(id) as any;
                profile._doc.count = map.get(id);
                return profile;
            });
        });
    },
    /**
     * Get spots skated by id
     */
    skatedBy(this: ISessionModel, id: string): Promise<ISession[]> {
        return this.find()
            .or([{ addedBy: id }, { with: id }])
            .populate('spots', 'id className createdAt updatedAt name type location geo')
            .exec()
            .then((sessions) => sessions.map((session) => session.spots))
            .then((spots) => [...new Set([].concat(...spots))]);
    },
    /**
     * Update all spots following from oriId spot to destId spot
     */
    updateAllSpot(this: ISessionModel, oriId: Types.ObjectId, destId: Types.ObjectId): Promise<any> {
        return this.updateMany({ spots: oriId }, { 'spots.$': destId }).exec();
    },
};

export const Session = mongoose.model<ISession, ISessionModel>('Session', SessionSchema);

export default Session;
