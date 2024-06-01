import { Document, Model, Types } from 'mongoose';

import mongoose from '../server/mongo';
import { IProfile } from './profile';
import utils from './utils';

export interface ILike extends Document {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    addedBy: Types.ObjectId | IProfile;
}

export interface ILikeModel extends Model<ILike> {
    /**
     * Get like
     */
    get(parent: { likes: Types.DocumentArray<ILike> }, id: Types.ObjectId): ILike;
}

export const LikeSchema = new mongoose.Schema(
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
            default: 'like',
        },
        addedBy: {
            type: String,
            ref: 'Profile',
            required: true,
            index: true,
        },
    },
    utils.genSchemaConf(),
);

LikeSchema.statics = {
    get(parent: { likes: Types.DocumentArray<ILike> }, id: Types.ObjectId): ILike {
        return parent.likes.id(id);
    },
};

export const Like = mongoose.model<ILike, ILikeModel>('Like', LikeSchema);

export default Like;
