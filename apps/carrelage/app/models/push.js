import httpStatus from 'http-status';

import mongoose from '../server/mongo';
import utils from './utils';
import APIError from '../helpers/api-error';

export const PushSchema = new mongoose.Schema(
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
        message: {
            type: String,
            required: true,
        },
        tokens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Installation' }],
    },
    utils.genSchemaConf(),
);

PushSchema.statics = {
    /**
     * Get push notification
     * @param {String} id - this _id of push notification
     * @return {Promise<Push, Error>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((push) => {
                if (push) {
                    return push;
                }

                const err = new APIError(['No such push notification'], httpStatus.NOT_FOUND);
                return Promise.reject(err);
            })
            .catch((e) => Promise.reject(e));
    },
    /**
     * List users in descending order of 'createdAt'
     * @param {number} skip - Number of push to be skipped
     * @param {number} limit - Limit number of users to be returned
     * @returns {Promise<Push[]>}
     */
    list({ skip = 0, limit = 20 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
};

/**
 * @typedef Push
 */
export default mongoose.model('Push', PushSchema);
