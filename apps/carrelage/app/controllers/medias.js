import { isPast } from 'date-fns';
import httpStatus from 'http-status';

import auth from '../server/auth';
import config from '../server/config';
import logger from '../server/logger';
import generateSelect from '../helpers/generate-select';
import cloudinary from '../helpers/cloudinary';
import APIError from '../helpers/api-error';
import arrayHelpers from '../helpers/array';
import '../helpers/replace-all';

import CloudinaryFile from '../models/cloudinary-file';
import Media from '../models/media';
import Notification from '../models/notification';
import Profile from '../models/profile';
import Spot from '../models/spot';
import TrickDone from '../models/trick-done';
import * as trickDoneCtrl from './tricks-done';
import rewardCtrl from './rewards';

/**
 * Load media and append to req
 */
function load(req, res, next) {
    Media.get(req.params.objectId)
        .then((media) => {
            req.object.push(media);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get media
 * @return {Media}
 */
function get(req, res) {
    const media = req.object.last().el();

    if (req.user && req.user.id !== media.addedBy.id) {
        delete media._doc.releaseDate;
    }

    return res.json(media);
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
        await profile.computeMediasStat();
        await profile.save();
    }
    if (spotId) {
        const id = spotId._id ? spotId._id : spotId;
        const spot = await Spot.findById(id).exec();
        await spot.computeMediasStat();
        await spot.save();
    }
}

/**
 * Create next media
 * @property {string} req.body.caption - The caption describing the media
 * @property {ObjectId} req.body.spot - The spotId where the media is located
 * @return {Media}
 */
async function create(req, res, next) {
    try {
        let media = new Media();
        media.addedBy = req.user.id;
        media._caption = req.body.caption;
        media.spot = req.body.spot;
        if (auth.isModerator(req) && req.body.releaseDate) {
            media.createdAt = req.body.releaseDate;
            media.releaseDate = req.body.releaseDate;
        }

        // Allow to override createdAt in dev
        if (config.NODE_ENV === 'development' && req.body.createdAt && isPast(req.body.createdAt)) {
            media.createdAt = req.body.createdAt;
        }

        if (req.body.trickDone) {
            const { trickDone: trickDoneData } = req.body;
            const trickDone = await TrickDone.build({
                trickId: trickDoneData.trick,
                stance: trickDoneData.stance,
                terrain: trickDoneData.terrain,
                shifty: trickDoneData.shifty,
                oneFooted: trickDoneData.oneFooted,
                bodyVarial: trickDoneData.bodyVarial,
                grab: trickDoneData.grab,
                validated: true,
            });
            media.trickDone = trickDone;
        }

        media.extractHashtagsMentions();
        media = await media.save();

        rewardCtrl.checkMedia(req.user.id);

        if (media.trickDone) {
            rewardCtrl.checkTrickDone(req.user.id);
        }

        res.json(media);
    } catch (error) {
        next(error);
    }
}

/**
 * Upload file to cloudinary and link it to a given media
 * @param {File} file - File to be uploaded
 * @param {Media} media - Media to link the file to
 * @return {Promise} return the savedMedia
 */
function uploadMediaToCloudinary(file, mediaRes, opts) {
    const media = mediaRes;
    const type = file.mimetype.split('/')[0];

    if (media.image || media.video) {
        return Promise.reject(new APIError(["You've already upload content to this media"], httpStatus.BAD_REQUEST));
    }

    if (type === 'image') {
        return cloudinary.upload(file, 'medias', media.image, opts).then((cloudinaryFile) => {
            media.type = type;
            media.image = cloudinaryFile;
            return media.save();
        });
    } else if (type === 'video') {
        return cloudinary.upload(file, 'medias', media.video, opts).then((cloudinaryFile) => {
            media.type = type;
            media.video = cloudinaryFile;

            media.image = new CloudinaryFile({
                publicId: cloudinaryFile.publicId,
                url: cloudinaryFile.url.replace('.mp4', '.webp'),
            });
            return media.save();
        });
    }
    return Promise.reject(new APIError(['Bad kind of file: %s', type], httpStatus.BAD_REQUEST));
}

function sendMentionNotification(fromUser, media, elementsList) {
    media.usertags.forEach((user) => {
        Notification.push(fromUser.id, user, 'mention', elementsList)
            .then((savedNotification) => {
                logger.info('saved notification', savedNotification);
            })
            .catch((e) => logger.error(e));
    });
}

/**
 * Upload a media
 * @property {file} req.file - File to be uploaded
 * @return {Profile}
 */
async function uploadMedia(req, res, next) {
    const media = req.object.last().el();
    try {
        const saved = await uploadMediaToCloudinary(req.file, media, req.body);
        sendMentionNotification(req.user, media, req.object.elementsList());
        await computeStatsIfNeeded(saved.addedBy, saved.spot);
        if (saved.trickDone) {
            await trickDoneCtrl.computeStatsIfNeeded(saved.addedBy, saved.spot);
        }
        res.json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Upload a list of file
 */
async function formDataUpload(req, res, next) {
    const media = new Media();
    media.addedBy = req.user.id;
    media._caption = req.body.caption;
    media.spot = req.body.spot;
    if (auth.isModerator(req) && req.body.releaseDate) {
        media.createdAt = req.body.releaseDate;
        media.releaseDate = req.body.releaseDate;
    }
    media.extractHashtagsMentions();

    try {
        const saved = await uploadMediaToCloudinary(req.file, media, req.body);
        await computeStatsIfNeeded(saved.addedBy, saved.spot);
        res.json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Update existing Media
 * @property {string} req.body.caption - The caption describing the media
 * @property {ObjectId} req.body.spot - The spotId where the media is located
 * @return {Media}
 */
async function update(req, res, next) {
    const media = req.object.last().el();

    if (req.body.caption) {
        media._caption = req.body.caption;
        media.extractHashtagsMentions();
    }
    if (req.body.spot) {
        try {
            const spot = await Spot.get(req.body.spot);
            media.spot = spot;
        } catch (err) {
            return next(err);
        }
    }
    if (auth.isModerator(req) && req.body.releaseDate) {
        media.createdAt = req.body.releaseDate;
        media.releaseDate = req.body.releaseDate;
    }

    if (req.body.trickDone !== undefined) {
        logger.debug('not undefined');
        if (req.body.trickDone !== null) {
            logger.debug('not null');
            const trickDone = await TrickDone.build({
                trickId: req.body.trickDone.trick,
                stance: req.body.trickDone.stance,
                terrain: req.body.trickDone.terrain,
                validated: true,
            });
            media.trickDone = trickDone;
        } else {
            media.trickDone = undefined;
        }
    }

    try {
        const saved = await media.save();
        await computeStatsIfNeeded(null, req.body.spot);
        await trickDoneCtrl.computeStatsIfNeeded(media.addedBy, media.spot);
        res.json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Get media list
 * @returns {Media[]}
 */
function list(req, res, next) {
    const { limit = 20, newer, older } = req.query;

    if (!auth.isModerator(req) && !req.query.hashtag) {
        next(auth.WRONG_PERMISSION);
        return;
    }

    let query = {};
    if (req.query.hashtag) {
        if (req.query.hashtag[0] !== '#') {
            req.query.hashtag = `#${req.query.hashtag}`;
        }
        query = { hashtags: req.query.hashtag };
    }
    if (!auth.isModerator(req)) {
        req.query.nonReleased = false;
    }

    const filters = req.query.with || ['comments'];
    const selects = generateSelect(filters, ['-comments']);

    Media.list({
        limit,
        newer,
        older,
        query,
        selects,
        released: req.query.nonReleased,
    })
        .then((medias) => {
            if (auth.isModerator(req)) {
                res.json(medias);
            } else {
                res.json(medias.map(arrayHelpers.removeReleaseDate));
            }
        })
        .catch((e) => next(e));
}

/**
 * Search medias
 * @returns {Media[]}
 */
async function search(req, res, next) {
    const { query, limit = 20 } = req.query;
    try {
        const medias = await Media.search(query, limit);
        res.json(medias);
    } catch (err) {
        next(err);
    }
}

/**
 * Delete media
 * @returns {Media}
 */
async function remove(req, res, next) {
    const media = req.object.last().el();
    let file = null;
    if (media.type === 'image') {
        file = media.image;
    } else if (media.type === 'video') {
        file = media.video;
    }

    try {
        const fileRes = await cloudinary.destroy(file).catch((err) => logger.warn(err, file));
        logger.debug('Deleted cloudinary', fileRes);
        const deletedMedia = await Media.deleteOne({ _id: media.id });
        await computeStatsIfNeeded(media.addedBy, media.spot);
        if (media.trickDone) {
            await trickDoneCtrl.computeStatsIfNeeded(media.addedBy, media.spot);
        }
        res.json(deletedMedia);
    } catch (err) {
        next(err);
    }

    try {
        if (config.NODE_ENV !== 'test') {
            // Delete all notifications related to this media
            await Notification.deleteMany({ 'objects.id': media.id });
            logger.info('Deleted notifications: ', response);
        }
    } catch (err) {
        logger.error(err);
    }
}

export default {
    load,
    get,
    create,
    uploadMedia,
    formDataUpload,
    update,
    list,
    search,
    remove,
};
