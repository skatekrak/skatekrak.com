import { Document, Model, Types } from 'mongoose';

import mongoose from '../server/mongo';
import { IUser } from './user';
import utils from './utils';

export enum DeviceType {
    IOS = 'ios',
    ANDROID = 'android',
}

export interface IInstallation extends Document {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    deviceToken: string;
    appVersion: number;
    version: string;
    deviceType: DeviceType;
    localeIdentifier: string;
    timezone: string;
    badge: number;
    channels: string[];
}

export interface IInstallationModel extends Model<IInstallation> {
    /**
     * Get installation from User
     */
    get(parent: IUser, id: Types.ObjectId | string): IInstallation;
}

export const InstallationSchema = new mongoose.Schema(
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
            default: 'installation',
        },
        deviceToken: {
            type: String,
            required: true,
        },
        appVersion: {
            type: Number,
        },
        version: {
            type: String,
        },
        deviceType: {
            type: String,
            required: true,
            enum: Object.values(DeviceType),
            index: true,
        },
        localeIdentifier: {
            type: String,
            match: [/[a-z]{2}-[A-Z]{2}$/, 'The value of {PATH} ({value}) is not a valid locale'],
        },
        timezone: {
            type: String,
            match: [/[a-zA-Z]+\/[a-zA-Z]+$/, 'The value of {PATH} ({VALUE}) is not a valid timezone'],
        },
        badge: {
            type: Number,
            default: 0,
        },
        channels: [String],
    },
    utils.genSchemaConf(),
);

/**
 * Statics
 */
InstallationSchema.statics = {
    get(parent: IUser, id: Types.ObjectId | string) {
        return parent.installations.id(id);
    },
};

/**
 * @typedef Installation
 */
export default mongoose.model('Installation', InstallationSchema);
