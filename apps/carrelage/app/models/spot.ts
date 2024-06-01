import httpStatus from 'http-status';
import { HydratedDocument, Model, Types as MongoTypes, Document } from 'mongoose';
import ngeohash from 'ngeohash';

import { spotIndex } from '../helpers/algolia';
import APIError from '../helpers/api-error';
import config from '../server/config';
import logger from '../server/logger';
import mongoose from '../server/mongo';
import utils from './utils';

import Clip from './clip';
import { CommentSchema, IComment } from './comment';
import Media from './media';
import Profile, { IProfile } from './profile';
import Session from './session';
import Stat, { IStat, StatSchema, Timeframes } from './stat';
import TrickDone from './trick-done';

export enum Types {
    Shop = 'shop',
    Street = 'street',
    Park = 'park',
    Diy = 'diy',
    Private = 'private',
}

export enum Status {
    Active = 'active',
    Wip = 'wip',
    Rip = 'rip',
}

export enum Obstacle {
    Stairs = 'stairs',
    Gap = 'gap',
    StreetGap = 'street gap',
    Ledge = 'ledge',
    Hubba = 'hubba',
    Bench = 'bench',
    LowToHigh = 'low to high',
    MannyPad = 'manny pad',
    Slappy = 'slappy',
    Polejam = 'polejam',
    Jersey = 'jersey',
    Drop = 'drop',
    Flatground = 'flatground',
    Handrail = 'handrail',
    Flatbar = 'flatbar',
    Bump = 'bump',
    Wallride = 'wallride',
    Bank = 'bank',
    Tranny = 'tranny',
    Spine = 'spine',
    Ramp = 'ramp',
    Bowl = 'bowl',
    Quarterpipe = 'quarterpipe',
    Fullpipe = 'fullpipe',
    Downhill = 'downhill',
    Hip = 'hip',
    Other = 'other',
}

import { ISpotEdit, SpotEditSchema } from './spot-edit';

export interface ILocation {
    streetName?: string;
    streetNumber?: string;
    city: string;
    country: string;
}

export interface ISpot extends Document {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    name: string;
    location: ILocation;
    geo: number[];
    geoHash: string;
    geoLoc: {
        type: string;
        coordinates: number[];
    };
    type: Types;
    status: Status;
    description: string;
    indoor: boolean;
    openingHours: string[];
    phone: string;
    website: string;
    instagram: string;
    snapchat: string;
    facebook: string;
    addedBy: string | IProfile;
    coverURL: string;
    commentsStat: IStat;
    comments: IComment[];
    edits: MongoTypes.DocumentArray<ISpotEdit>;
    mediasStat: IStat;
    clipsStat: IStat;
    tricksDoneStat: IStat;
    tags: string[];
    obstacles: Obstacle[];
}

interface ISpotMethods {
    /**
     * Set Longitude & Latitude
     */
    setGeoLoc(longitude: number, latitude: number): void;
    /**
     * Merge this spot into another one
     * Transfer all Comments & Update Medias, Clips, TrickDones
     */
    mergeInto(spot: SpotDocument): Promise<SpotDocument>;
    /**
     * Compute Medias stat
     */
    computeMediasStat(): Promise<void>;
    /**
     * Compute Clips stat
     */
    computeClipsStat(): Promise<void>;
    /**
     * Compute Tricks done stat
     */
    computeTricksDoneStat(): Promise<void>;
}

export interface ISpotModel extends Model<ISpot, {}, ISpotMethods> {
    GEOHASH_LENGTH: number;
    /**
     * Get spot
     */
    get(id: MongoTypes.ObjectId): Promise<SpotDocument>;
    /**
     * Fetch spot by list of ids
     */
    fetch(ids: MongoTypes.ObjectId[]): Promise<SpotDocument[]>;
    /**
     * List spots in descending order of 'createdAt'
     */
    list(limit?: number, newer?: Date, older?: Date, query?: any, selects?: string): Promise<SpotDocument[]>;
    /**
     * Lfist spot comments
     */
    comments(limit?: number, newer?: Date, older?: Date, query?: any): Promise<IComment[]>;
    /**
     * Search Spot
     */
    search(query: string, limit?: number): Promise<SpotDocument[]>;
    /**
     * Get Spots where most medias where uploaded
     */
    mostMediasUploaded(limit?: number, timeframe?: Timeframes): Promise<SpotDocument[]>;
}

export const SpotSchema = new mongoose.Schema<ISpot, ISpotModel, ISpotMethods>(
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
            default: 'spot',
        },
        name: {
            type: String,
            required: true,
        },
        location: {
            type: {
                streetName: String,
                streetNumber: String,
                city: String,
                country: String,
            },
            default: {},
        },
        geo: {
            type: [Number],
            index: '2dsphere',
            default: [0, 0],
        },
        geoHash: {
            type: String,
            index: true,
        },
        geoLoc: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
                index: '2dsphere',
            },
        },
        type: {
            type: String,
            enum: Object.values(Types),
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(Status),
            required: true,
            default: Status.Active,
            index: true,
        },
        description: {
            type: String,
        },
        indoor: {
            type: Boolean,
            required: true,
            default: false,
            index: true,
        },
        openingHours: {
            type: [String],
        },
        phone: {
            type: String,
        },
        website: {
            type: String,
        },
        instagram: {
            type: String,
        },
        snapchat: {
            type: String,
        },
        facebook: {
            type: String,
        },
        addedBy: {
            type: String,
            ref: 'Profile',
            required: true,
            index: true,
        },
        coverURL: {
            type: String,
            match: [
                /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/,
                'The value of path {PATH} ({VALUE}) is not a valid URL.',
            ],
        },
        commentsStat: StatSchema,
        comments: [CommentSchema],
        edits: [SpotEditSchema],
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
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        obstacles: {
            type: [String],
            enum: Object.values(Obstacle),
            default: [],
            index: true,
        },
    },
    utils.genSchemaConf((_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.__parse_id;
        delete ret.edits;
        return ret;
    }),
);

SpotSchema.index(
    {
        name: 'text',
        type: 'text',
        status: 'text',
        obstacles: 'text',
        'location.streetName': 'text',
        'location.city': 'text',
        'location.country': 'text',
        description: 'text',
        addedBy: 'text',
        geoLoc: '2dsphere',
    },
    {
        name: 'spot_index_text',
        weights: {
            name: 10,
            type: 6,
            status: 6,
            obstacles: 6,
            'location.streetName': 6,
            'location.city': 6,
            'location.country': 6,
            description: 4,
            addedBy: 4,
        },
    },
);

SpotSchema.pre('save', async function(this: ISpot, next) {
    this.commentsStat = Stat.build(this.comments);
    logger.debug('Spot pre-save hook');
    next();
});

SpotSchema.post('save', async (doc, next) => {
    if (config.NODE_ENV !== 'test' && config.NODE_ENV !== 'development') {
        logger.debug('Spot post-save hook');
        const algoliaSpot: Record<string, any> = {
            objectID: doc._id,
            name: doc.name,
            coverURL: doc.coverURL,
            type: doc.type,
            status: doc.status,
            indoor: doc.indoor,
            tags: doc.tags,
            obstacles: doc.obstacles,
            mediaStat: doc.mediasStat,
            clipsStat: doc.clipsStat,
            facebook: doc.facebook,
            instagram: doc.instagram,
            snapchat: doc.snapchat,
            website: doc.website,
            location: doc.location,
            _geoloc: {
                lat: doc.geo[1],
                lng: doc.geo[0],
            },
        };
        await spotIndex.saveObject(algoliaSpot);
    }
    next();
});

SpotSchema.post('deleteOne', async (doc) => {
    if (config.NODE_ENV !== 'test' && config.NODE_ENV !== 'development') {
        logger.debug('Spot post-remove hook');
        await spotIndex.deleteObject(doc._id);
    }
});

SpotSchema.virtual('location.longitude').get(function(this: ISpot) {
    return this.geo ? this.geo[0] : null;
});
SpotSchema.virtual('location.latitude').get(function(this: ISpot) {
    return this.geo ? this.geo[1] : null;
});

SpotSchema.methods = {
    setGeoLoc(longitude: number, latitude: number) {
        this.geo = [longitude, latitude];
        this.geoHash = ngeohash.encode(latitude, longitude, Spot.GEOHASH_LENGTH);
        this.geoLoc = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };
    },
    async mergeInto(spot) {
        const [mediasRes, clipRes, trickRes, profileRes, sessionRes] = await Promise.all([
            Media.updateAllSpot(this.id, spot.id),
            Clip.updateAllSpot(this.id, spot.id),
            TrickDone.updateAllSpot(this.id, spot.id),
            Profile.updateAllSpot(this.id, spot.id),
            Session.updateAllSpot(this.id, spot.id),
        ]);
        logger.info({
            mediaUpdated: mediasRes.nModified,
            clipUpdated: clipRes.nModified,
            trickUpdated: trickRes.nModified,
            profileUpdated: profileRes.nModified,
            sessionUpdated: sessionRes.nModified,
        });
        // Copy comments from this Spot
        spot.comments.push(...this.comments);
        // Remove this spot
        await this.deleteOne();
        // Compute Stats
        await spot.computeMediasStat();
        await spot.computeClipsStat();
        await spot.computeTricksDoneStat();
        // Save the merged spot
        return spot.save();
    },
    async computeMediasStat() {
        this.mediasStat = Stat.build(
            await Media.list({
                limit: 0,
                older: new Date(),
                query: { spot: this.id },
            }),
        );
        logger.debug('Spot compute Medias stat');
    },
    async computeClipsStat() {
        this.clipsStat = Stat.build(await Clip.list(0, null, new Date(), { spot: this.id }));
        logger.debug('Spot compute Clips stat');
    },
    async computeTricksDoneStat() {
        this.tricksDoneStat = Stat.build(
            (
                await Media.list({
                    limit: 0,
                    older: new Date(),
                    query: { spot: this.id, trickDone: { $exists: true } },
                })
            ).map((media) => media.trickDone),
        );
        logger.debug('Spot compute TricksDone stat');
    },
};

function genComment(spot: any): IComment {
    const comment = spot.comments;
    comment.spot = spot;
    delete comment.spot.comments;
    comment.id = comment._id;
    comment.spot.id = comment.spot._id;
    delete comment.spot._id;
    delete comment.spot.__v;
    let content = comment._content.repeat(1);
    for (let i = 0; i < comment.usertags.length; i += 1) {
        const handle = comment.usertags[i];
        content = content.replaceAll(`{{${i}}}`, `@${handle}`);
    }
    comment.content = content;
    delete comment._content;
    return comment;
}

SpotSchema.statics = {
    /**
     * Get spot
     */
    async get(this, id: MongoTypes.ObjectId): Promise<ISpot> {
        const spot = await this.findById(id)
            .populate('addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .exec();
        if (spot) {
            return spot;
        }
        throw new APIError(['No such spot exists'], httpStatus.NOT_FOUND);
    },
    /**
     * Fetch spot by list of id
     */
    fetch(this, ids: MongoTypes.ObjectId[]): Promise<ISpot[]> {
        return this.find({ _id: { $in: ids } }).exec();
    },
    /**
     * List spots in descending order of 'createdAt'
     */
    list(this, limit = 20, newer?: Date, older?: Date, query: any = {}, selects = ''): Promise<ISpot[]> {
        const q = this.find(query)
            .select(selects)
            .populate('addedBy', 'profilePicture')
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
     * List spot comments
     */
    async comments(limit = 20, newer?: Date, older?: Date, query = {}): Promise<IComment[]> {
        const match = newer
            ? {
                  $match: { $and: [{ 'comments.createdAt': { $gt: newer } }, query] },
              }
            : {
                  $match: { $and: [{ 'comments.createdAt': { $lt: older } }, query] },
              };
        const spots: SpotDocument[] = await this.aggregate([
            { $unwind: '$comments' },
            match,
            { $sort: { 'comments.createdAt': -1 } },
            { $limit: limit },
        ]).exec();

        const spotsLoaded = await Profile.populate(spots, {
            path: 'comments.addedBy',
            select: 'profilePicture',
        });
        return spotsLoaded.map((spot) => genComment(spot));
    },

    /**
     * Search Spot
     */
    search(this, query: string, limit = 20): Promise<ISpot[]> {
        return this.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .exec();
    },
    /**
     * Get Spots where most medias where uploaded
     */
    mostMediasUploaded(this, limit = 20, timeframe: Timeframes = Timeframes.All): Promise<ISpot[]> {
        const q = this.find()
            .populate('addedBy', 'profilePicture')
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .limit(limit);
        Stat.createQuery(q, 'mediasStat', timeframe);
        return q.exec();
    },
};

export const Spot = mongoose.model<ISpot, ISpotModel>('Spot', SpotSchema);
export type SpotDocument = HydratedDocument<ISpot, ISpotMethods>;

Spot.GEOHASH_LENGTH = 12;

export default Spot;
