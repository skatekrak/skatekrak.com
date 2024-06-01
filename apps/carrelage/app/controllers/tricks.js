import httpStatus from 'http-status';

import APIError from '../helpers/api-error';
import Trick from '../models/trick';
import Media from '../models/media';
import LearnVideo from '../models/learn-video';
import gStorage from '../helpers/gstorage';
import arrayHelpers from '../helpers/array';
import TrickDone from '../models/trick-done';

/**
 * Load trick and append to req
 */
function load(req, res, next) {
    Trick.get(req.params.trickId)
        .then((trick) => {
            req.object.push(trick);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get trick
 * @return {Trick}
 */
async function get(req, res, next) {
    try {
        const trick = req.object
            .last()
            .el()
            .toJSON();
        // Only for this request, we query the number of people that did this trick
        trick.numberOfSkaters = await TrickDone.uniqAddedBy(trick.id);
        return res.json(trick);
    } catch (error) {
        return next(error);
    }
}

/**
 * Create trick
 * @property {string} req.body.name Id of the trick
 * @property {string} req.body.displayName Name of the trick
 * @property {string} req.body.difficultyLevel Difficulty of the trick
 * @property {number} req.body.order Order of the trick in the list
 * @property {string} req.body.terrain Type of terrain
 * @property {string} req.body.category Category of the trick
 * @property {Object} [req.body.switch]
 * @property {boolean} [req.body.switch.possible] Is the trick doable in switch
 * @property {number} [req.body.switch.bonus] Bonus point if it was done in switch
 * @property {Object} [req.body.fakie]
 * @property {boolean} [req.body.fakie.possible] Is the trick doable in fakie
 * @property {number} [req.body.fakie.bonus] Bonus point if it was done in fakie
 * @property {Object} [req.body.nollie]
 * @property {boolean} [req.body.nollie.possible] Is the trick doable in nollie
 * @property {number} [req.body.nollie.bonus] Bonus point if it sas done in nollie
 * @property {string[]} req.body.keywords List of keywords for search
 * @property {number} req.body.points Number of points for doing this trick
 * @return {Trick}
 */
function create(req, res, next) {
    const trick = new Trick({
        _id: req.body.name,
        name: req.body.displayName,
        hashtag: `#${req.body.name}`,
        order: req.body.order,
        difficultyLevel: req.body.difficultyLevel,
        keywords: req.body.keywords,
        points: req.body.points,
    });

    if (req.body.switch) {
        trick.switch = req.body.switch;
    }

    if (req.body.fakie) {
        trick.fakie = req.body.fakie;
    }

    if (req.body.nollie) {
        trick.nollie = req.body.nollie;
    }

    trick
        .save()
        .then((savedTrick) => res.json(savedTrick))
        .catch((e) => next(e));
}

/**
 * Update trick
 * @property {string} req.body.name - New id of the trick
 * @property {string} req.body.displayName - New name for the trick
 * @property {number} req.body.difficulty - New diff of the trick
 * @property {number} req.body.order - New position in the trick list
 */
function update(req, res, next) {
    const trick = req.object.last().el();

    if (req.body.displayName) {
        trick.name = req.body.displayName;
    }

    if (req.body.order) {
        trick.order = req.body.order;
    }

    if (req.body.difficultyLevel) {
        trick.difficulty = req.body.difficultyLevel;
    }

    if (req.body.points) {
        trick.points = req.body.points;
    }

    if (req.body.keywords) {
        trick.keywords = req.body.keywords;
    }

    if (req.body.switch) {
        trick.switch = req.body.switch;
    }

    if (req.body.fakie) {
        trick.fakie = req.body.fakie;
    }

    if (req.body.nollie) {
        trick.nollie = req.body.nollie;
    }

    trick
        .save()
        .then((savedTrick) => res.json(savedTrick))
        .catch((e) => next(e));
}

/**
 * Upload a illustration for the trick
 * @param {File} req.file - file of the illustration
 * @return {Trick}
 */
function upload(req, res, next) {
    const trick = req.object.last().el();

    gStorage
        .uploadToGCloud(req.file.buffer, 'tricks', trick.getFilename())
        .then((url) => {
            trick.pictureURL = url;
            return trick.save();
        })
        .then((savedTrick) => res.json(savedTrick))
        .catch((e) => next(e));
}

/**
 * List all tricks
 * @returns {Trick[]}
 */
function list(req, res, next) {
    Trick.list()
        .then((tricks) => res.json(tricks))
        .catch((e) => next(e));
}

/**
 * Delete trick
 * @return {Trick}
 */
async function remove(req, res, next) {
    const trick = req.object.last().el();

    try {
        const videos = await LearnVideo.find({ trick: trick.id });

        if (videos.length > 0) {
            const err = new APIError(
                ["You can't delete a Trick when there is video attached to it"],
                httpStatus.UNAUTHORIZED,
            );
            return Promise.reject(err);
        }

        try {
            await gStorage.deleteFromGCloud('tricks', trick.getFilename());
        } catch (googleErrors) {
            // We don't throw an error if the error was that this trick don't have any file attached
            if (googleErrors.errors.length > 1 || googleErrors.errors[0].reason !== 'notFound') {
                throw googleErrors;
            }
        }

        const removedTrick = await trick.remove();
        return res.json(removedTrick);
    } catch (error) {
        return next(error);
    }
}

/**
 * Get medias for this trick
 */
function medias(req, res, next) {
    const trick = req.object.last().el();

    const { limit = 20, newer, older = new Date() } = req.query;

    Media.list({
        limit,
        newer,
        older,
        query: { hashtags: trick.hashtag },
    })
        .then((mediasRes) => res.json(mediasRes.map(arrayHelpers.removeReleaseDate)))
        .catch((e) => next(e));
}

function tricksDone(req, res, next) {
    const trick = req.object.last().el();

    const { limit = 20, newer, older = new Date() } = req.query;

    TrickDone.list({
        limit,
        newer,
        older,
        fullMedia: true,
        withMedia: true,
        query: { trick: trick.id },
    })
        .then((tricksDoneRes) => res.json(tricksDoneRes))
        .catch((e) => next(e));
}

/**
 * Search tricks
 * @returns {Trick[]}
 */
async function search(req, res, next) {
    const { query, limit = 20 } = req.query;
    try {
        const tricks = await Trick.search(query, limit);
        res.json(tricks);
    } catch (err) {
        next(err);
    }
}

/**
 * Return the number total of points that can be made
 * @return {Promise<number>} Points
 */
async function totalPoints() {
    const tricks = await Trick.list();

    let points = 0;

    tricks.forEach((trick) => {
        points += trick.points;
    });

    return points;
}

export default {
    load,
    get,
    create,
    update,
    upload,
    list,
    remove,
    medias,
    tricksDone,
    search,
    totalPoints,
};
