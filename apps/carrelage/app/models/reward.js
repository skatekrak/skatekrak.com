import httpStatus from 'http-status';

import mongoose from '../server/mongo';
import APIError from '../helpers/api-error';
import utils from './utils';

import REWARDS from '../../config/rewards.json';
export const REWARD_TYPE = Object.keys(REWARDS);

export const RewardSchema = new mongoose.Schema(
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
            default: 'reward',
        },
        type: {
            type: String,
            required: true,
            enum: REWARD_TYPE,
        },
        subtype: {
            type: String,
            required: true,
        },
    },
    utils.genSchemaConf((doc, retJson) => {
        const ret = retJson;
        delete ret._id;
        delete ret.__v;

        const reward = REWARDS[ret.type][ret.subtype];
        if (reward) {
            ret.name = reward.name;
            ret.description = reward.description;
            ret.badge = reward.badge;
        }

        delete ret.type;
        delete ret.subtype;

        return ret;
    }),
);

RewardSchema.methods = {};

RewardSchema.statics = {
    /**
     * Get reward
     * @param {Object} parent - Object of the like's parent
     * @param {ObjectId} id - this _id of a reward
     * @returns {Reward}
     */
    get(parent, id) {
        return parent.rewards.id(id);
    },

    /**
     * Potentially create a reward based on request
     * @param {String} types
     * @param {Promise<Number>} request
     */
    async create(type, request) {
        if (REWARDS[type]) {
            const count = await request;
            if (REWARDS[type][count]) {
                const reward = new this({ type, subtype: count });
                return reward;
            }
            return null;
        }
        return new APIError(['This reward type does not exist'], httpStatus.BAD_REQUEST);
    },

    /**
     * Get total of points of rewards
     * @param {Reward[]} rewards
     */
    pointsTotal(rewards) {
        return rewards.reduce((acc, reward) => {
            if (REWARDS[reward.type][reward.subtype]) {
                const mul = reward.subtype * REWARDS[reward.type][reward.subtype].multiplier;
                return acc + mul;
            }
            return acc;
        });
    },
};

export default mongoose.model('Reward', RewardSchema);
