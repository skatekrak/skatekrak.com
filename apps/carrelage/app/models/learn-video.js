import httpStatus from 'http-status';
import APIError from '../helpers/api-error';

import mongoose from '../server/mongo';
import utils from './utils';

import { CommentSchema } from './comment';
import { LikeSchema } from './like';

export const LearnVideoSchema = new mongoose.Schema(
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
            default: 'learn-video',
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        provider: {
            type: String,
            enum: ['youtube', 'vimeo'],
            index: true,
        },
        thumbnailURL: {
            type: String,
            required: true,
        },
        videoURL: {
            type: String,
            required: true,
        },
        trick: {
            type: String,
            ref: 'Trick',
            required: true,
            index: true,
        },
        likes: [LikeSchema],
        comments: [CommentSchema],
    },
    utils.genSchemaConf(),
);

/**
 * Statics
 */
LearnVideoSchema.statics = {
    /**
     * Get Learn Video
     * @param {ObjectId} id - This _id of Learn Video
     */
    get(id) {
        return this.findById(id)
            .populate('comments.addedBy', 'profilePicture')
            .populate('comments.likes.addedBy', 'profilePicture')
            .populate('likes', 'profilePicture')
            .exec()
            .then((video) => {
                if (video) {
                    return video;
                }

                return Promise.reject(new APIError(['No such learn video'], httpStatus.NOT_FOUND));
            })
            .catch((e) => Promise.reject(e));
    },

    /**
     * List clips in descending order of 'createdAt'
     */
    list({ skip = 0, limit = 20, trick } = {}) {
        return this.find({ trick })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
};

/**
 * @typedef Clip
 */
export default mongoose.model('LearnVideo', LearnVideoSchema);
