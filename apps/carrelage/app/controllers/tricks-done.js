import { isPast } from 'date-fns';

import config from '../server/config';
import Profile from '../models/profile';
import Spot from '../models/spot';
import TrickDone from '../models/trick-done';

/**
 * Load trick achieve and append to req
 */
function load(req, res, next) {
    TrickDone.get(req.params.objectId)
        .then((trickDone) => {
            req.object.push(trickDone);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get Trick Achieve
 * @return {TrickAchieve}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Compute profile & spot stats if needed
 * @param {any} addedBy
 * @param {any} spotId
 */
export async function computeStatsIfNeeded(addedBy, spotId) {
    if (addedBy) {
        const id = addedBy._id ? addedBy._id : addedBy;
        const profile = await Profile.findById(id).exec();
        await profile.computeTricksDoneStat();
        await profile.save();
    }
    if (spotId) {
        const id = spotId._id ? spotId._id : spotId;
        const spot = await Spot.findById(id).exec();
        await spot.computeTricksDoneStat();
        await spot.save();
    }
}

async function create(req, res, next) {
    try {
        let trickDone = await TrickDone.build({
            trickId: req.body.trick,
            addedBy: req.user.id,
            stance: req.body.stance,
            spot: req.body.spot,
            terrain: req.body.terrain,
            shifty: req.body.shifty,
            oneFooted: req.body.oneFooted,
            bodyVarial: req.body.bodyVarial,
            grab: req.body.grab,
        });

        // Allow to override createdAt in dev
        if (config.NODE_ENV === 'development' && req.body.createdAt && isPast(req.body.createdAt)) {
            trickDone.createdAt = req.body.createdAt;
        }

        trickDone = await trickDone.save();
        res.json(trickDone);
    } catch (e) {
        next(e);
    }
}

async function list(req, res, next) {
    const { limit = 20, newer, older, trick, withMedia } = req.query;
    let fullMedia = false;
    const query = {};
    if (trick) {
        query.trick = trick;
        fullMedia = true;
    }

    try {
        const tricksDone = await TrickDone.list({
            limit,
            newer,
            older,
            fullMedia,
            withMedia,
            query,
        });
        res.json(tricksDone);
    } catch (error) {
        next(error);
    }
}

/**
 * Delete a trick done
 */
async function remove(req, res, next) {
    try {
        const trick = req.object.last().el();
        const deleted = await trick.remove();
        await computeStatsIfNeeded(deleted.addedBy, deleted.spot);
        res.json(deleted);
    } catch (err) {
        next(err);
    }
}

export default {
    load,
    get,
    create,
    list,
    remove,
};
