import httpStatus from 'http-status';

import Reward from '../models/reward';
import APIError from '../helpers/api-error';
import Profile from '../models/profile';
import Media from '../models/media';
import Clip from '../models/clip';
import Spot from '../models/spot';

/**
 *
 *
 * @param {Profile} profile Profile which to give the reward
 * @param {string} type Type of the reward
 * @param {string} subtype subtype of the reward (level)
 * @return {Promise<Profile>}
 */
async function createReward(profile, type, subtype) {
    const existing = profile.rewards.find((r) => r.type === type && r.subtype === subtype);

    if (existing) {
        return profile;
    }

    const reward = new Reward({ type, subtype });
    profile.rewards.push(reward);

    const savedProfile = await profile.save();
    return savedProfile;
}

// CRUD

/**
 * Load Reward and append to req
 */
function load(req, res, next) {
    const reward = Reward.get(req.object.last().el(), req.params.objectId);

    if (reward) {
        req.object.push(reward);
        next();
    } else {
        next(new APIError(['No such reward'], httpStatus.NOT_FOUND));
    }
}

/**
 * Get Reward
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Create new Reward
 */
async function create(req, res, next) {
    const { type, subtype } = req.body;
    const parent = req.object.last().el();

    try {
        const savedProfile = await createReward(parent, type, subtype);
        res.json(savedProfile);
    } catch (err) {
        next(err);
    }
}

/**
 * Remove Reward
 */
async function remove(req, res, next) {
    const reward = req.object.last().el();
    const parent = req.object
        .last()
        .parent()
        .el();
    try {
        parent.rewards.id(reward._id).remove();
        await req.object
            .first()
            .el()
            .save();
        res.json(reward);
    } catch (err) {
        next(err);
    }
}

// Check of reward rules

/**
 * Triggered after a like is created, and will check 2 rewards
 * - create_like: Check how much the `from` gave
 * - receive_like: Check how much the `to` received
 * @param {string} from
 * @param {string} to
 */
async function checkLike(from, to) {
    try {
        const fromProfile = await Profile.get(from);
        // Check the likes for the `from` user
        const fromNumbersOfLikes =
            (await Media.find({ 'likes.addedBy': fromProfile.id }).count()) +
            (await Clip.find({ 'like.addedBy': fromProfile.id }).count());
        if (fromNumbersOfLikes === 1) {
            // create_like:Baby Liker
            createReward(fromProfile, 'create_like', '1');
        } else if (fromNumbersOfLikes === 10) {
            // create_like:Wat a Liker
            createReward(fromProfile, 'create_like', '10');
        } else if (fromNumbersOfLikes === 100) {
            // create_like:Lover
            createReward(fromProfile, 'create_like', '100');
        }

        const toProfile = await Profile.get(to);
        const toNumbersOfLikes =
            (await Media.find({ addedBy: toProfile.id, 'likes.0': { $exists: true } }).count()) +
            (await Clip.find({ 'like.addedBy': toProfile.id }).count());
        if (toNumbersOfLikes === 1) {
            // receive_like:Someone
            createReward(toProfile, 'receive_like', '1');
        } else if (toNumbersOfLikes === 10) {
            // receive_like:Popular
            createReward(toProfile, 'receive_like', '10');
        } else if (toNumbersOfLikes === 100) {
            // receive_like:Famous
            createReward(toProfile, 'receive_like', '100');
        }
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Check if the `from` profile should receive reward for the comment he made
 * @param {string} from
 */
async function checkComment(from) {
    try {
        const fromProfile = await Profile.get(from);

        // Query Media and Clip that have been commented by the `from` Profile but not created by him/her
        const numberOfComments =
            (await Media.find({ 'comments.addedBy': fromProfile.id, addedBy: { $ne: fromProfile.id } }).count()) +
            (await Clip.find({ 'comments.addedBy': fromProfile.id, addedBy: { $ne: fromProfile.id } }).count());

        if (numberOfComments === 1) {
            // create_comment:Baby Chatter
            createReward(fromProfile, 'create_comment', '1');
        } else if (numberOfComments === 10) {
            // create_comment:Chit-Chat
            createReward(fromProfile, 'create_comment', '10');
        } else if (numberOfComments === 100) {
            // create_comment:Write
            createReward(fromProfile, 'create_comment', '100');
        }
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Check how many spot were created by the user
 * @param {string} from Profile id
 */
async function checkSpot(from) {
    try {
        const fromProfile = await Profile.get(from);

        const numberOfSpots = await Spot.find({ addedBy: fromProfile.id }).count();

        if (numberOfSpots === 1) {
            createReward(fromProfile, 'create_spot', '1');
        } else if (numberOfSpots === 10) {
            createReward(fromProfile, 'create_spot', '10');
        } else if (numberOfSpots === 100) {
            createReward(fromProfile, 'create_spot', '100');
        }
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Check how many media were created by the user
 * @param {*} from
 */
async function checkMedia(from) {
    try {
        const fromProfile = await Profile.get(from);

        const numberOfMedia = await Media.find({ addedBy: fromProfile.id }).count();

        if (numberOfMedia === 1) {
            createReward(fromProfile, 'create_media', '1');
        } else if (numberOfMedia === 10) {
            createReward(fromProfile, 'create_media', '10');
        } else if (numberOfMedia === 100) {
            createReward(fromProfile, 'create_media', '100');
        }
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Check how many clip were posted by the user
 * @param {string} from Profile ID
 */
async function checkClip(from) {
    try {
        const fromProfile = await Profile.get(from);

        const numberOfClips = await Clip.find({ addedBy: fromProfile.id }).count();

        if (numberOfClips === 1) {
            createReward(fromProfile, 'create_clips', '1');
        } else if (numberOfClips === 10) {
            createReward(fromProfile, 'create_clips', '10');
        } else if (numberOfClips === 100) {
            createReward(fromProfile, 'create_clips', '100');
        }
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Check how many validated trickDone were done
 * @param {string} from Profile ID
 */
async function checkTrickDone(from) {
    try {
        const fromProfile = await Profile.get(from);

        const numberOfTrickDone = await Media.find({ addedBy: fromProfile.id, trickDone: { $exists: true } }).count();

        if (numberOfTrickDone === 1) {
            createReward(fromProfile, 'create_tricksDone', '1');
        } else if (numberOfTrickDone === 10) {
            createReward(fromProfile, 'create_tricksDone', '10');
        } else if (numberOfTrickDone === 100) {
            createReward(fromProfile, 'create_tricksDone', '100');
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default {
    load,
    get,
    create,
    remove,
    checkLike,
    checkComment,
    checkSpot,
    checkMedia,
    checkClip,
    checkTrickDone,
};
