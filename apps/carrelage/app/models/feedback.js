import httpStatus from 'http-status';

import APIError from '../helpers/api-error';
import mongoose from '../server/mongo';
import utils from './utils';

export const FeedbackSchema = new mongoose.Schema(
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
            default: 'feedback',
        },
        message: {
            type: String,
            required: true,
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

/**
 * Statics
 */
FeedbackSchema.statics = {
    /**
     * Get feedback
     * @param {ObjectId} id - This _id of Media
     * @returns {Promise<Feeback, Error>}
     */
    get(id) {
        return this.findById(id)
            .populate('addedBy', 'profilePicture')
            .exec()
            .then((feedback) => {
                if (feedback) {
                    return feedback;
                }

                const err = new APIError(['No such feedback exists'], httpStatus.NOT_FOUND);
                return Promise.reject(err);
            })
            .catch((e) => Promise.reject(e));
    },

    /**
     * List feedbacks in descending order of 'createdAt'
     * @param {number} skip - Number of feedbacks to be skipped
     * @param {number} limit - Limit of number of feedbacks to be returned
     * @returns {Promise<Media[]}
     */
    list({ skip = 0, limit = 20 } = {}) {
        return this.find()
            .populate('addedBy', 'profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
};

/**
 * @typedef Feedback
 */
export default mongoose.model('Feedback', FeedbackSchema);
