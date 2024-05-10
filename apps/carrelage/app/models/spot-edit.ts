import { Document, Model, Types as MongoTypes } from 'mongoose';

import mongoose from '../server/mongo';
import utils from './utils';

import { IProfile } from './profile';
import { Status, Types } from './spot';

export interface ISpotEdit extends Document {
    /**
     * Metadata
     */
    createdAt: Date;
    updatedAt: Date;
    className: string;
    addedBy: string | IProfile;
    /**
     * Edits
     */
    name: string;
    longitude: number;
    latitude: number;
    type: Types;
    status: Status;
    description: string;
    indoor: boolean;
    phone: string;
    website: string;
    instagram: string;
    snapchat: string;
    facebook: string;
    mergeInto: MongoTypes.ObjectId;
}

export interface ISpotEditModel extends Model<ISpotEdit> {
    /**
     * Get SpotEdit
     */
    get(parent: { edits: MongoTypes.DocumentArray<ISpotEdit> }, id: MongoTypes.ObjectId): ISpotEdit;
}

export const SpotEditSchema = new mongoose.Schema(
    {
        /**
         * Metadata
         */
        createdAt: {
            type: Date,
        },
        updatedAt: {
            type: Date,
        },
        className: {
            type: String,
            default: 'spot-edit',
        },
        addedBy: {
            type: String,
            ref: 'Profile',
            required: true,
        },
        /**
         * Edits
         */
        name: {
            type: String,
        },
        longitude: {
            type: Number,
        },
        latitude: {
            type: Number,
        },
        type: {
            type: String,
            enum: Object.values(Types),
        },
        status: {
            type: String,
            enum: Object.values(Status),
        },
        description: {
            type: String,
        },
        indoor: {
            type: Boolean,
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
        mergeInto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spot',
        },
    },
    utils.genSchemaConf(),
);

SpotEditSchema.statics = {
    get(parent: { edits: MongoTypes.DocumentArray<ISpotEdit> }, id: MongoTypes.ObjectId): ISpotEdit {
        return parent.edits.id(id);
    },
};

export const SpotEdit = mongoose.model<ISpotEdit, ISpotEditModel>('SpotEdit', SpotEditSchema);

export default SpotEdit;
