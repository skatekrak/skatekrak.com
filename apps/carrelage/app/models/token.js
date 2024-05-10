import httpStatus from 'http-status';
import geoip from 'geoip-lite';

import mongoose from '../server/mongo';
import utils from './utils';
import APIError from '../helpers/api-error';

export const TokenSchema = new mongoose.Schema(
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
            default: 'token',
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: String,
            ref: 'User',
            required: true,
            index: true,
        },
        role: {
            type: String,
            required: true,
        },
        expires: {
            type: Date,
            required: false,
            sparse: true,
        },
        ip: {
            type: String,
            required: false,
        },
        location: {
            type: String,
            required: false,
        },
        userAgent: {
            type: String,
            required: false,
        },
    },
    utils.genSchemaConf((doc, retJson) => {
        const ret = retJson;
        delete ret._id;
        delete ret.__v;
        delete ret.token;
        return ret;
    }),
);

/**
 * Methods
 */
TokenSchema.methods = {
    /**
     * Set metadata from headers
     * @param {Object} headers
     */
    setMetadata(headers = {}) {
        if (headers['x-forwarded-for']) {
            const ip = headers['x-forwarded-for'].split(',')[0];
            const geo = geoip.lookup(ip);

            let location = '';
            if (geo) {
                if (geo.city) {
                    location += `${geo.city}, `;
                }
                if (geo.region) {
                    location += `${geo.region}, `;
                }
                if (geo.country) {
                    location += geo.country;
                }
            }

            this.ip = ip;
            this.location = location;
        }
        if (headers['user-agent']) {
            this.userAgent = headers['user-agent'];
        }
    },
};

/**
 * Statics
 */
TokenSchema.statics = {
    /**
     * Get token by ObjectId
     * @param {String} id - id of the token
     * @returns {Promise<Token, Error>}
     */
    getById(id) {
        return this.findById(id)
            .exec()
            .then((token) => {
                if (token) {
                    return token;
                }
                return Promise.reject(new APIError(['No such token exists'], httpStatus.NOT_FOUND));
            })
            .catch((e) => Promise.reject(e));
    },

    /**
     * Get token by Token value
     * @param {String} tokenId - Value/Id of the token
     * @returns {Promise}
     */
    getByToken(tokenId) {
        return this.findOne({ token: tokenId })
            .exec()
            .then((token) => token)
            .catch((err) => Promise.reject(err));
    },

    /**
     * Return the tokens for the given userId
     * @param {string} userId - _id of a user
     * @returns {Promise<Token[], Error>}
     */
    list(userId) {
        return this.find({
            user: userId,
        }).exec();
    },

    /**
     * Remove specific token
     * @param {string} tokenId
     */
    remove(tokenId) {
        return this.deleteOne({ token: tokenId });
    },

    /**
     * Remove all the tokens belonging to the given user
     * @param {string} userId - _id of user
     */
    removeAllFrom(userId) {
        return this.deleteMany({ user: userId }).exec();
    },

    /**
     * Rename all the tokens belonging to the given user to newUserId
     * @param {string} userId - current _id of user
     * @param {string} newUserId - new _id of user
     * @return {Promise<Token[], Error>}
     */
    rename(userId, newUserId) {
        return this.update({ user: userId }, { user: newUserId }, { multi: true }).exec();
    },

    /**
     * Ensure root token is created
     * @param {String} rootToken
     * @param {Object} rootUser
     * @returns {Promise}
     */
    ensureRootCreation(rootTokenId, rootUser) {
        return this.getByToken(rootTokenId).then((token) => {
            if (token) {
                return token;
            }

            const rootToken = new this({
                token: rootTokenId,
                user: rootUser.id,
                role: rootUser.role,
            });
            return rootToken.save();
        });
    },
};

/**
 * @typedef TokenSchema
 */
export default mongoose.model('Token', TokenSchema);
