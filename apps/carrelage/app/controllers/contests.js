import httpStatus from 'http-status';

import APIError from '../helpers/api-error';
import gStorage from '../helpers/gstorage';
import Contest from '../models/contest';
import Media from '../models/media';
import arrayHelpers from '../helpers/array';

/**
 * Load contest and append to req
 */
function load(req, res, next) {
    Contest.get(req.params.objectId)
        .then((contest) => {
            req.object.push(contest);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get contest
 */
function get(req, res, next) {
    const contest = req.object.last().el();
    contest
        .fetchPostsNumber()
        .then((c) => {
            res.json(c);
        })
        .catch((e) => next(e));
}

/**
 * Create new contest
 * @property {string} req.body.title - Title for contest
 * @property {string} req.body.description - Description for the contest
 * @property {Date} req.body.endDate - End date for contest
 * @property {string} req.body.reward - Reward for the contest
 * @return {Contest}
 */
function create(req, res, next) {
    const contest = new Contest({
        title: req.body.title,
        description: req.body.description,
        endDate: new Date(req.body.endDate),
        reward: req.body.reward,
    });

    return contest
        .save()
        .then((savedContest) => res.json(savedContest))
        .catch((e) => next(e));
}

/**
 * Update existing contest
 * @property {string} req.body.title - New title for the contest
 * @property {string} req.body.description - New description for te contest
 * @property {string} req.body.endDate - new end date for the contest
 * @return {Contest}
 */
function update(req, res, next) {
    const contest = req.object.last().el();

    if (req.body.description) {
        contest.description = req.body.description;
    }

    if (req.body.endDate) {
        contest.endDate = new Date(req.body.endDate);
    }

    if (req.body.reward) {
        contest.reward = req.body.reward;
    }

    if (req.body.title) {
        // Check if there is any Media posted with the contest hashtag
        Media.count({ hashtags: contest.title })
            .exec()
            .then((count) => {
                if (count > 0) {
                    return Promise.reject(
                        new APIError(
                            ["You can't change the contest title when there is pictures posted with the hashtag"],
                            httpStatus.UNAUTHORIZED,
                        ),
                    );
                }
                contest.title = req.body.title;
                return contest.save();
            })
            .then((savedContest) => res.json(savedContest))
            .catch((e) => next(e));
    } else {
        contest
            .save()
            .then((savedContest) => res.json(savedContest))
            .catch((e) => next(e));
    }
}

/**
 * Upload a logo for the contest
 * @param {File} req.file - Create or update the logo of the contest
 */
function upload(req, res, next) {
    const contest = req.object.last().el();

    gStorage
        .uploadToGCloud(req.file.buffer, 'contests', contest.getFilename())
        .then((url) => {
            contest.logoURL = url;
            return contest.save();
        })
        .then((savedContest) => res.json(savedContest))
        .catch((e) => next(e));
}

/**
 * List all contests
 * @returns {Contest[]}
 */
function list(req, res, next) {
    Contest.list()
        .then((contests) => Promise.all(contests.map((contest) => contest.fetchPostsNumber())))
        .then((contests) => res.json(contests))
        .catch((e) => next(e));
}

/**
 * Remove a contest
 * @return {Contest}
 */
function remove(req, res, next) {
    const contest = req.object.last().el();

    gStorage
        .deleteFromGCloud('contests', contest.getFilename())
        .then(() => contest.remove())
        .then((deletedContest) => res.json(deletedContest))
        .catch((e) => next(e));
}

/**
 * Get medias for the contest
 */
function medias(req, res, next) {
    const contest = req.object.last().el();
    const { limit = 20, newer, older } = req.query;
    Media.list({
        limit,
        newer,
        older,
        query: { hashtags: contest.title },
    })
        .then((mediasRes) => res.json(mediasRes.map(arrayHelpers.removeReleaseDate)))
        .catch((e) => next(e));
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
};
