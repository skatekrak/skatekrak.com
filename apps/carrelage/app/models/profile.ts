import httpStatus from 'http-status';
import { Document, Model, Types } from 'mongoose';

import APIError from '../helpers/api-error';
import logger from '../server/logger';
import mongoose from '../server/mongo';
import utils from './utils';

import Clip from './clip';
import { CloudinaryFileSchema, ICloudinaryFile } from './cloudinary-file';
import Gear, { GearSchema, IGear } from './gear';
import Media from './media';
import { RewardSchema } from './reward';
import Session from './session';
import { ISpot } from './spot';
import Stat, { IStat, StatSchema } from './stat';
import { ITrickWish, TrickWishSchema } from './trick-wish';

export enum Stances {
    Goofy = 'goofy',
    Regular = 'regular',
}

export interface IProfile extends Document {
    _id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    className: string;
    description: string;
    location: string;
    stance: Stances;
    snapchat: string;
    instagram: string;
    website: string;
    sponsors: string[];
    profilePicture: ICloudinaryFile;
    banner: ICloudinaryFile;
    followersStat: IStat;
    followers: Types.DocumentArray<IProfile>;
    followingStat: IStat;
    following: Types.DocumentArray<IProfile>;
    spotsFollowingStat: IStat;
    spotsFollowing: Types.DocumentArray<ISpot>;
    gears: IGear;
    tricksWishlist: Types.DocumentArray<ITrickWish>;
    mediasStat: IStat;
    clipsStat: IStat;
    tricksDoneStat: IStat;
    rewards: Types.DocumentArray<any>;

    /**
     * Fetch Profile stats counters
     */
    fetchCounters(this: IProfile): Promise<any>;
    /**
     * Compute Medias stat
     */
    computeMediasStat(this: IProfile): Promise<IProfile>;
    /**
     * Compute Clips stat
     */
    computeClipsStat(): Promise<IProfile>;
    /**
     * Compute Tricks done stat
     */
    computeTricksDoneStat(): Promise<IProfile>;
}

export interface IProfileModel extends Model<IProfile> {
    /**
     * Get profile
     */
    get(this: IProfileModel, id: string, populate?: boolean): Promise<IProfile>;
    /**
     * Create a new profile
     */
    build(this: IProfileModel, username: string): Promise<IProfile>;
    /**
     * List profile in descending order of 'createdAt'
     */
    list(this: IProfileModel, { skip, limit }: { skip?: number; limit?: number }): Promise<IProfile[]>;
    /**
     * Count spot followers on spotId
     */
    countSpotFollowers(this: IProfileModel, spotId: Types.ObjectId): Promise<number>;
    /**
     * Search profile by text
     */
    search(this: IProfileModel, query: string, limit?: number): Promise<IProfile[]>;
    /**
     * Update all spots following from oriId spot to destId spot
     */
    updateAllSpot(this: IProfileModel, oriId: Types.ObjectId, destId: Types.ObjectId): Promise<any>;
}

export const ProfileSchema = new mongoose.Schema<IProfile>(
    {
        _id: {
            type: String,
            // match: [/^[a-z0-9_]{1,15}$/, "The value of path {PATH} ({VALUE}) is not a valid username."],
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
            default: 'profile',
        },
        description: String,
        location: String,
        stance: {
            type: String,
            enum: Object.values(Stances),
        },
        snapchat: String,
        instagram: String,
        website: String,
        sponsors: [String],
        profilePicture: CloudinaryFileSchema,
        banner: CloudinaryFileSchema,
        followersStat: StatSchema,
        followers: {
            type: [{ type: String, ref: 'Profile' }],
            index: true,
        },
        followingStat: StatSchema,
        following: {
            type: [{ type: String, ref: 'Profile' }],
            index: true,
        },
        spotsFollowingStat: StatSchema,
        spotsFollowing: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Spot' }],
            index: true,
        },
        gears: {
            type: GearSchema,
            default: new Gear(),
        },
        tricksWishlist: [TrickWishSchema],
        mediasStat: {
            type: StatSchema,
            default: Stat.build(),
        },
        clipsStat: {
            type: StatSchema,
            default: Stat.build(),
        },
        tricksDoneStat: {
            type: StatSchema,
            default: Stat.build(),
        },
        rewards: [RewardSchema],
    },
    utils.genSchemaConf((_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.__parse_id;
        delete ret.__old_profile_picture;
        return ret;
    }),
);

ProfileSchema.index(
    {
        _id: 'text',
        instagram: 'text',
        snapchat: 'text',
        location: 'text',
        description: 'text',
        sponsors: 'text',
        website: 'text',
    },
    {
        name: 'profile_index_text',
        weights: {
            _id: 10,
            instagram: 5,
            snapchat: 5,
            location: 3,
            description: 2,
            sponsors: 2,
            website: 1,
        },
    },
);

ProfileSchema.pre('save', async function(this: IProfile, next) {
    this.followersStat = Stat.build(this.followers, true);
    this.followingStat = Stat.build(this.following, true);
    this.spotsFollowingStat = Stat.build(this.spotsFollowing, true);
    logger.debug('Profile pre-save hook');
    next();
});

ProfileSchema.virtual('username')
    .get(function(this: IProfile) {
        return this._id ? this._id : null;
    })
    .set(function(this: IProfile, val: string) {
        this._id = val;
    });

ProfileSchema.methods = {
    async fetchCounters(this: IProfile): Promise<any> {
        const obj = this.toJSON();
        const [sessionCount, skatedCount] = await Promise.all([
            Session.countWithBy(this.id),
            Session.countSkatedBy(this.id),
        ]);
        const mediaCount = obj.mediasStat.all;
        return {
            ...obj,
            sessionCount,
            skatedCount,
            mediaCount,
        };
    },
    async computeMediasStat(this: IProfile): Promise<IProfile> {
        this.mediasStat = Stat.build(
            await Media.list({
                limit: 0,
                older: new Date(),
                query: { addedBy: this.id },
            }),
        );
        logger.debug('Profile compute Medias stat');
        return this;
    },
    async computeClipsStat(this: IProfile): Promise<IProfile> {
        this.clipsStat = Stat.build(await Clip.list(0, null, new Date(), { addedBy: this.id }));
        logger.debug('Profile compute Clips stat');
        return this;
    },
    async computeTricksDoneStat(this: IProfile): Promise<IProfile> {
        const medias = await Media.list({
            limit: 0,
            older: new Date(),
            query: { addedBy: this.id, trickDone: { $exists: true } },
        });
        logger.debug('Medias', medias);
        const tricksDone = medias.map((media) => media.trickDone);
        logger.debug('Tricks done', tricksDone);

        this.tricksDoneStat = Stat.build(tricksDone);
        logger.debug('Profile compute TricksDone stat');
        return this;
    },
};

ProfileSchema.statics = {
    async get(this: IProfileModel, id: string, populate = true): Promise<IProfile> {
        const query = this.findById(id);
        if (populate) {
            query
                .populate('followers', 'profilePicture')
                .populate('following', 'profilePicture')
                .populate('spotsFollowing', 'name location type')
                .populate('tricksWishlist.trick');
        }
        const profile = await query.exec();
        if (profile) {
            return profile;
        }
        throw new APIError(['No such profile exists'], httpStatus.NOT_FOUND);
    },
    async build(this: IProfileModel, username: string): Promise<IProfile> {
        const exist = await this.findById(username).exec();
        if (exist) {
            return exist;
        }
        const profile = new this();
        profile.gears = new Gear();
        profile.username = username;
        return profile.save();
    },
    list(this: IProfileModel, { skip = 0, limit = 20 }: { skip: number; limit: number }): Promise<IProfile[]> {
        return this.find()
            .populate('followers', 'profilePicture')
            .populate('following', 'profilePicture')
            .populate('spotsFollowing', 'name location type')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
    countSpotFollowers(this: IProfileModel, spotId: Types.ObjectId): Promise<number> {
        return this.where('spotsFollowing')
            .equals(spotId)
            .countDocuments()
            .exec();
    },
    search(this: IProfileModel, query: string, limit = 20): Promise<IProfile[]> {
        return this.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .exec();
    },
    updateAllSpot(this, oriId: Types.ObjectId, destId: Types.ObjectId): Promise<any> {
        return this.updateMany(
            { spotsFollowing: (oriId as unknown) as ISpot },
            { $addToSet: { spotsFollowing: destId } },
        )
            .exec()
            .then(() =>
                this.updateMany(
                    { spotsFollowing: (oriId as unknown) as ISpot },
                    { $pull: { spotsFollowing: oriId } },
                ).exec(),
            );
    },
};

export const Profile = mongoose.model<IProfile, IProfileModel>('Profile', ProfileSchema);

export default Profile;
