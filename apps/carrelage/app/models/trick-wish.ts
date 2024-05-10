import { Document, Model } from 'mongoose';

import mongoose from '../server/mongo';
import utils from './utils';

import Profile, { IProfile } from './profile';
import { ITrick, Terrains, TrickStances } from './trick';

export interface ITrickWish extends Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    trick: string | ITrick;
    terrain: Terrains;
    stance: TrickStances;
    amountWanted: number;
    currentlyDone: number;

    /**
     * Set id based on combination
     */
    setId(this: ITrickWish): void;
}

export interface ITrickWishModel extends Model<ITrickWish> {
    /**
     * Check if profile already contains this TrickWish
     */
    exist(
        this: ITrickWishModel,
        profileId: string,
        { trick, stance, terrain }: { trick: string; stance: TrickStances; terrain: Terrains },
    ): Promise<boolean>;
    /**
     * Increment done counter of a TrickWish
     */
    increment(
        this: ITrickWishModel,
        profileId: string,
        { trick, stance, terrain }: { trick: string; stance: TrickStances; terrain: Terrains },
    ): Promise<IProfile>;
    /**
     * Increment done counter of a TrickWish if it already exist
     */
    incrementIfExist(
        this: ITrickWishModel,
        profileId: string,
        { trick, stance, terrain }: { trick: string; stance: TrickStances; terrain: Terrains },
    ): Promise<IProfile>;
}

export const TrickWishSchema = new mongoose.Schema<ITrickWish>(
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
        trick: {
            type: String,
            ref: 'Trick',
            required: true,
            index: true,
        },
        terrain: {
            type: String,
            enum: Object.values(Terrains),
            required: true,
            index: true,
        },
        stance: {
            type: String,
            enum: Object.values(TrickStances),
            required: true,
            index: true,
        },
        amountWanted: {
            type: Number,
            required: true,
            default: 1,
        },
        currentlyDone: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    utils.genSchemaConf(),
);

TrickWishSchema.virtual('points').get(function(this: ITrickWish) {
    const trick = this.trick as ITrick;
    if (trick && trick.points) {
        return trick.points;
    }
    return 0;
});

TrickWishSchema.methods = {
    /**
     * Set id based on combination
     */
    setId(this: ITrickWish): void {
        if (!this._id) {
            this._id = `${this.terrain}_${this.stance}_${this.trick}`;
        }
    },
};

TrickWishSchema.statics = {
    async exist(
        this: ITrickWishModel,
        profileId: string,
        { trick, stance, terrain }: { trick: string; stance: TrickStances; terrain: Terrains },
    ): Promise<boolean> {
        const profile = await Profile.get(profileId);
        const trickWish = profile.tricksWishlist.id(`${terrain}_${stance}_${trick}`);
        if (trickWish) {
            return true;
        }
        return false;
    },
    async increment(
        this: ITrickWishModel,
        profileId: string,
        { trick, stance, terrain }: { trick: string; stance: TrickStances; terrain: Terrains },
    ): Promise<IProfile> {
        const profile = await Profile.get(profileId);
        profile.tricksWishlist.id(`${terrain}_${stance}_${trick}`).currentlyDone += 1;
        return await profile.save();
    },
    async incrementIfExist(
        this: ITrickWishModel,
        profileId: string,
        { trick, stance, terrain }: { trick: string; stance: TrickStances; terrain: Terrains },
    ): Promise<IProfile> {
        const profile = await Profile.get(profileId);
        const id = `${terrain}_${stance}_${trick}}`;
        if (profile.tricksWishlist.id(id)) {
            profile.tricksWishlist.id(id).currentlyDone += 1;
            return await profile.save();
        }
        return profile;
    },
};

export const TrickWish = mongoose.model<ITrickWish, ITrickWishModel>('TrickWhish', TrickWishSchema);

export default TrickWish;
