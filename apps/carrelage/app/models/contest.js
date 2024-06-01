import httpStatus from 'http-status';
import APIError from '../helpers/api-error';

import mongoose from '../server/mongo';
import utils from './utils';
import Media from './media';

export const ContestSchema = new mongoose.Schema(
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
            default: 'contest',
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        reward: {
            type: String,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        logoURL: String,
    },
    utils.genSchemaConf(),
);

/**
 * Methods
 */
/**
 * Get filename of S3 file
 */
ContestSchema.methods.getFilename = function() {
    return `${this.id}.png`;
};

ContestSchema.methods.fetchPostsNumber = function() {
    return Media.countByHashtag(this.title).then((count) => {
        const obj = this.toJSON();
        obj.posts = count;
        return obj;
    });
};

/**
 * Statics
 */
ContestSchema.statics = {
    /**
     * Get Contest
     * @param {ObjectId} id - This _id of Contest
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((contest) => {
                if (contest) {
                    return contest;
                }

                return Promise.reject(new APIError(['No such contest'], httpStatus.NOT_FOUND));
            })
            .catch((e) => Promise.reject(e));
    },

    /**
     * List all contest
     * @param {limit} [limit=20]
     */
    list(limit = 20) {
        return this.find()
            .sort({ endDate: -1 })
            .limit(limit)
            .exec();
    },

    /**
     * List all session happening for the last 24h
     * @param {number} [limit=20]
     */
    active(limit = 20) {
        const today = new Date();

        return this.find()
            .sort({ endDate: -1 })
            .where('endDate')
            .gt(today)
            .limit(limit)
            .exec();
    },
};

/**
 * @typedef Contest
 */
export default mongoose.model('Contest', ContestSchema);
