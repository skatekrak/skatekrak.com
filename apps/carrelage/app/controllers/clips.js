import { isPast } from 'date-fns';

import config from '../server/config';
import logger from '../server/logger';
import videoHelper from '../helpers/videos';

import Clip from '../models/clip';
import Notification from '../models/notification';
import Profile from '../models/profile';
import Spot from '../models/spot';
import rewardCtrl from './rewards';

/**
 * Load Clip and append to req
 */
function load(req, res, next) {
    Clip.get(req.params.objectId)
        .then((clip) => {
            req.object.push(clip);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get clip
 * @return {Clip}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Compute profile & spot stats if needed
 * @param {any} addedBy
 * @param {any} spotId
 */
async function computeStatsIfNeeded(addedBy, spotId) {
    if (addedBy) {
        const id = addedBy._id ? addedBy._id : addedBy;
        const profile = await Profile.findById(id).exec();
        await profile.computeClipsStat();
        await profile.save();
    }
    if (spotId) {
        const id = spotId._id ? spotId._id : spotId;
        const spot = await Spot.findById(id).exec();
        await spot.computeClipsStat();
        await spot.save();
    }
}

/**
 * Create new clip
 * @property {string} req.body.url - Url of the video
 * @property {ObjectId} req.body.spot - Id of the spot to which the Clip is attached
 * @return {Clip}
 */
async function create(req, res, next) {
    const clip = new Clip({
        videoURL: req.body.url,
        spot: req.body.spot,
        addedBy: req.user._id,
    });

    // Allow to override createdAt in dev
    if (config.NODE_ENV === 'development' && req.body.createdAt && isPast(req.body.createdAt)) {
        clip.createdAt = req.body.createdAt;
    }

    try {
        const info = await videoHelper.getVideoInformation(clip.videoURL);
        clip.provider = info.provider;
        clip.title = info.title;
        clip.description = info.description;
        clip.thumbnailURL = info.thumbnailURL;
        const saved = await clip.save();
        await computeStatsIfNeeded(clip.addedBy, clip.spot);
        rewardCtrl.checkClip(req.user.id);
        res.json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Update an existing Clip
 * @property {string} req.body.title - Title of the video
 * @property {string} req.body.description - Description of the video
 * @property {ObjectId} req.body.spot - Id of the new spot
 * @property {string} req.body.thumbnailURL - URL of the new thumbnail
 * @return {Clip}
 */
async function update(req, res, next) {
    const clip = req.object.last().el();

    if (req.body.title) {
        clip.title = req.body.title;
    }
    if (req.body.description) {
        clip.description = req.body.description;
    }
    if (req.body.spot) {
        clip.spot = req.body.spot;
    }
    if (req.body.thumbnailURL) {
        clip.thumbnailURL = req.body.thumbnailURL;
    }

    try {
        const saved = await clip.save();
        await computeStatsIfNeeded(null, req.body.spot);
        res.json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * List Clips
 * @property {number} skip - Number of clips to be skipped
 * @property {number} limit - Limit of clips to be returned
 * @returns {Clip[]}
 */
function list(req, res, next) {
    const { limit = 20, newer, older } = req.query;

    Clip.list(limit, newer, older)
        .then((clips) => res.json(clips))
        .catch((e) => next(e));
}

/**
 * Delete clip
 * @return {Clip}
 */
async function remove(req, res, next) {
    const clip = req.object.last().el();

    try {
        const deleted = await Clip.deleteOne({ _id: clip.id });
        await computeStatsIfNeeded(clip.addedBy, clip.spot);
        res.json(deleted);
    } catch (err) {
        next(err);
    }

    try {
        const notifs = await Notification.find({ 'objects.id': clip.id }).exec();
        const response = await Promise.all(notifs.map((notif) => notif.remove()));
        logger.info('Deleted notifications: ', response);
    } catch (err) {
        logger.error(err);
    }
}

async function videoInformation(req, res, next) {
    const { url } = req.query;
    try {
        const info = await videoHelper.getVideoInformation(url);
        res.json(info);
    } catch (error) {
        next(error);
    }
}

export default {
    load,
    get,
    create,
    update,
    list,
    remove,
    videoInformation,
};
