import httpStatus from 'http-status';
import moment from 'moment';

import APIError from '../helpers/api-error';
import cloudinary from '../helpers/cloudinary';
import arrayHelpers from '../helpers/array';
import logger from '../server/logger';

import Profile from '../models/profile';
import Notification from '../models/notification';

import Media from '../models/media';
import Spot from '../models/spot';
import Session from '../models/session';
import Clip from '../models/clip';
import TrickDone from '../models/trick-done';
import object from '../helpers/object';
import TrickCtrl from './tricks';

/**
 * Load profile and append to req
 */
function load(req, res, next) {
    Profile.get(req.params.userId)
        .then((profile) => {
            req.object.push(profile);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get profile
 * @returns {Profile}
 */
function get(req, res, next) {
    const profile = req.object.last().el();
    profile
        .fetchCounters()
        .then((p) => res.json(p))
        .catch((e) => next(e));
}

function me(req, res, next) {
    Profile.get(req.user.id)
        .then((profile) => profile.fetchCounters())
        .then((profile) => res.json(profile))
        .catch((e) => next(e));
}

/**
 * Search profiles
 * @returns {Profile[]}
 */
async function search(req, res, next) {
    const { query, limit = 20 } = req.query;
    try {
        const profiles = await Profile.search(query, limit);
        res.json(profiles);
    } catch (err) {
        next(err);
    }
}

/**
 * Update existing profile
 * @returns {Profile}
 */
function update(req, res, next) {
    const profile = req.object.last().el();

    const keys = Object.keys(req.body).filter((k) => k !== 'gears');
    logger.debug('Keys', typeof keys, keys);
    keys.forEach((key) => {
        if (req.body[key] !== null) {
            logger.debug('not delete', key, req.body[key]);
            profile[key] = req.body[key];
        } else {
            logger.debug('should delete', key);
            profile[key] = undefined;
        }
    });

    if (req.body.gears) {
        const { gears } = req.body;
        const gearsType = Object.keys(req.body.gears);
        logger.debug('Gears type', gearsType);
        gearsType.forEach((gearType) => {
            logger.debug('Check for', gearType);
            if (gears[gearType] !== null) {
                profile.gears[gearType] = gears[gearType];
            } else {
                logger.debug('should delete');
                profile.gears[gearType] = undefined;
            }
            logger.debug(profile.gears.toJSON());
        });
    }

    profile
        .save()
        .then((savedProfile) => res.json(savedProfile))
        .catch((e) => next(e));
}

/**
 * Upload a profile picture
 * @property {file} req.file - File to be uploaded
 * @return {Profile}
 */
function uploadProfilePicture(req, res, next) {
    const profile = req.object.last().el();
    cloudinary
        .upload(req.file, 'profiles', profile.profilePicture, req.body)
        .then((cloudinaryFile) => {
            profile.profilePicture = cloudinaryFile;
            return profile.save();
        })
        .then((savedProfile) => res.json(savedProfile))
        .catch((e) => next(e));
}

/**
 * Upload a profile banner
 * @property {file} req.file - File to be uploaded
 * @return {Profile}
 */
function uploadBanner(req, res, next) {
    const profile = req.object.last().el();
    cloudinary
        .upload(req.file, 'banners', profile.banner, req.body)
        .then((cloudinaryFile) => {
            profile.banner = cloudinaryFile;
            return profile.save();
        })
        .then((savedProfile) => res.json(savedProfile))
        .catch((e) => next(e));
}

/**
 * Multi-part upload for ProfilePicture and Banner
 * @property {file} req.files - Files to be uploaded
 * @return {Profile}
 */
function uploadProfilePictureAndBanner(req, res, next) {
    const profile = req.object.last().el();

    Promise.all([
        cloudinary.upload(req.files.profilePicture[0], 'profiles', profile.profilePicture),
        cloudinary.upload(req.files.banner[0], 'banners', profile.banner),
    ])
        .then((files) => {
            logger.info(files);
            [profile.profilePicture, profile.banner] = files;
            return profile.save();
        })
        .then((savedProfile) => res.json(savedProfile))
        .catch((e) => next(e));
}

/**
 * Get profile list
 * @property {number} req.query.skip - Number of profiles to be skipped
 * @property {number} req.query.limit - Limit of profiles to be returned
 * @returns {Profile[]}
 */
function list(req, res, next) {
    const { limit = 20, skip = 0 } = req.query;
    Profile.list({ limit, skip })
        .then((profiles) => res.json(profiles))
        .catch((e) => next(e));
}

/**
 * Follow the profile
 * @param {ObjectId} id - profileId
 */
function follow(req, res, next) {
    const profile = req.object.last().el();

    if (profile._id === req.user._id) {
        next(new APIError(["You can't follow yourself"], httpStatus.BAD_REQUEST));
        return;
    }

    Profile.get(req.user._id)
        .then((loggedProfile) => {
            if (!loggedProfile.following.includes(profile._id)) {
                Notification.push(loggedProfile._id, profile._id, 'follow')
                    .then((savedNotification) => {
                        logger.info('saved notification', savedNotification);
                    })
                    .catch((e) => next(e));
            }

            // lets add this user to the logged user's following list
            loggedProfile.following.addToSet(profile._id);
            return loggedProfile.save();
        })
        .then((loggedProfile) => {
            // Lets add the logged user to the profile's follower list
            profile.followers.addToSet(loggedProfile._id);
            return profile.save();
        })
        .then((savedProfile) => {
            res.json(savedProfile);
        })
        .catch((e) => next(e));
}

/**
 * Unfollow the profile
 * @param {ObjectId} id - profileId
 */
function unfollow(req, res, next) {
    const profile = req.object.last().el();

    Profile.get(req.user._id)
        .then((loggedProfile) => {
            Notification.findOneAndRemove({
                type: 'follow',
                fromUser: loggedProfile._id,
                toUser: profile._id,
            })
                .exec()
                .then((deletedNotification) => {
                    logger.info('deleted notification', deletedNotification);
                })
                .catch((e) => next(e));

            loggedProfile.following.pull(profile._id);
            return loggedProfile.save();
        })
        .then((loggedProfile) => {
            profile.followers.pull(loggedProfile._id);
            return profile.save();
        })
        .then((savedProfile) => {
            res.json(savedProfile);
        })
        .catch((e) => next(e));
}

/**
 * Get profile feed
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function feed(req, res, next) {
    const username = req.object.last().el()._id;
    const { limit = 20, newer, older } = req.query;

    Promise.all([
        Media.list({
            limit,
            newer,
            older,
            query: { addedBy: username },
        }),
        Spot.list(limit, newer, older, { addedBy: username }),
        Clip.list(limit, newer, older, { addedBy: username }),
        TrickDone.list({
            limit,
            newer,
            older,
            query: { addedBy: username, media: { $exists: false } },
        }),
    ])
        .then((objs) => {
            let all = [].concat(...objs);
            all = all.sort(arrayHelpers.sortByCreatedAt).map(arrayHelpers.removeReleaseDate);

            res.json(all.slice(0, limit));
        })
        .catch((err) => {
            next(err);
        });
}

/**
 * Get Medias created by this Profile
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 * @param {boolean} [trickDone] Tell if need to query media with/without trickDone
 */
function medias(req, res, next) {
    const username = req.object.last().el()._id;
    const { limit = 20, newer, older } = req.query;
    const query = {
        addedBy: username,
    };

    if (req.query.trickDone !== undefined) {
        query.trickDone = { $exists: req.query.trickDone };
    }

    Media.list({
        limit,
        newer,
        older,
        query,
    })
        .then((mediasRes) => res.json(mediasRes.map(arrayHelpers.removeReleaseDate)))
        .catch((err) => next(err));
}

/**
 * Get Spots created by this Profile
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function spots(req, res, next) {
    const username = req.object.last().el()._id;
    const { limit = 20, newer, older } = req.query;
    Spot.list(limit, newer, older, { addedBy: username })
        .then((sessionsRes) => res.json(sessionsRes))
        .catch((err) => next(err));
}

/**
 * Get Sessions created by this Profile
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function sessions(req, res, next) {
    const username = req.object.last().el()._id;
    const { limit = 20, newer, older } = req.query;
    Session.list(limit, newer, older, { $or: [{ addedBy: username }, { with: username }] })
        .then((sessionsRes) => res.json(sessionsRes))
        .catch((err) => next(err));
}

/**
 * Get Spots skated by this Profile
 */
function skated(req, res, next) {
    const username = req.object.last().el()._id;
    Session.skatedBy(username)
        .then((spotsRes) => res.json(spotsRes))
        .catch((err) => next(err));
}

/**
 * Get Clips created by this Profile
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function clips(req, res, next) {
    const username = req.object.last().el()._id;
    const { limit = 20, newer, older } = req.query;
    Clip.list(limit, newer, older, { addedBy: username })
        .then((clipsRes) => res.json(clipsRes))
        .catch((err) => next(err));
}

/**
 * Get TricksDone created by this Profile
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function tricksDone(req, res, next) {
    const username = req.object.last().el()._id;
    const { limit = 20, newer, older } = req.query;
    TrickDone.list({
        limit,
        newer,
        older,
        query: { addedBy: username },
    })
        .then((tricksDoneRes) => res.json(tricksDoneRes))
        .catch((err) => next(err));
}

/**
 * Generate the labels for the graphs, based on when to start and end, and the period
 * @param {moment} from Start of the labels
 * @param {moment} to End of the labels
 * @param {"day" | "week" | "month"} period
 * @returns {string[]}
 */
function generateLabels(from, to, period) {
    const labels = [];
    if (period === 'day' || period === 'week') {
        labels.push(from.format('D MMM'));

        while (from.isBefore(to)) {
            const date = from.add(1, period);
            labels.push(date.format('D MMM'));
        }
    } else if (period === 'month') {
        labels.push(from.format('MMMM'));

        while (from.isBefore(to)) {
            const date = from.add(1, 'month');
            labels.push(date.format('MMMM'));
        }
    }
    return labels;
}

function getMonday(d) {
    const copy = new Date(d);
    const day = copy.getDay();
    // adjust when day is sunday
    const diff = copy.getTime() - day + (day === 0 ? -6 : 1); // eslint-disable-line no-mixed-operators
    return new Date(d.setDate(diff));
}

function exists(key, value, array) {
    for (let i = 0; i < array.length; i += 1) {
        const element = array[i];
        if (element[key] === value) {
            logger.debug(element);
            return true;
        }
    }
    return false;
}

function precisionRound(num, precision) {
    const factor = 10 ** precision;
    return Math.round(num * factor) / factor;
}

/**
 * Get amout a points between given dates, and a given period
 * @param {Date} req.query.from Starting date
 * @param {Date} req.query.to Ending date
 * @param {boolean} [req.query.validated=true] Precise if only get points from validated or not validated tricks
 * @param {string} [req.query.terrain] Precise the terrains to get the points from
 * @param {string} [req.query.stance] Precise the stance of the tricks done
 * @param {string} [req.query.trick] Precise the trick of the tricks done
 * @param {string} [req.body.period=week] week/day/month
 */
async function pointsGraph(req, res, next) {
    const { period, validated } = req.query;
    let { from, to } = req.query;
    logger.debug(typeof validated, validated);

    from = moment(from);
    to = moment(to);

    // If it's by month, we make sure that the first day is the first one the month, end same idea for the end
    if (period === 'month') {
        from.date(1)
            .hours(0)
            .minutes(0)
            .seconds(0);
        to.date(31)
            .hours(23)
            .minutes(59)
            .seconds(59);
    }

    // Check if start is a monday, and end is a sunday, only if it's a week
    if (period === 'week') {
        if (from.day() !== 1) {
            return next(new APIError(['The `from` date must be a Monday'], httpStatus.BAD_REQUEST));
        }

        if (to.day() !== 0) {
            return next(new APIError(['The `to` date must be a Sunday'], httpStatus.BAD_REQUEST));
        }
    }

    const profile = req.object.last().el();
    let query = { addedBy: profile.id };
    if (validated) {
        query = Object.assign(query, {
            trickDone: {
                $exists: true,
            },
        });
    }

    query = object.deleteUndefined(query);

    try {
        let results = [];
        if (validated) {
            const meds = await Media.query({ from: from.toDate(), to: to.toDate(), query });
            results = meds.map((media) => media.trickDone);
        } else {
            results = await TrickDone.query({ from: from.toDate(), to: to.toDate(), query });
        }

        const periods = {};
        const labels = generateLabels(from, to, period);
        const numbersOfTricksDone = [];
        const totalPoints = [];

        labels.forEach((label) => {
            periods[label] = {
                numberOfTricksDone: 0,
                totalPoints: 0,
            };
        });

        results.forEach((result) => {
            const createdAt = moment(result.createdAt);

            if (period === 'week') {
                const monday = moment(getMonday(result.createdAt)).format('D MMM');

                periods[monday].numberOfTricksDone += 1;
                periods[monday].totalPoints += result.totalPoints;
            } else if (period === 'month') {
                const month = createdAt.format('MMMM');

                periods[month].numberOfTricksDone += 1;
                periods[month].totalPoints += result.totalPoints;
            } else if (period === 'day') {
                const formattedDay = createdAt.format('D MMM');

                periods[formattedDay].numberOfTricksDone += 1;
                periods[formattedDay].totalPoints += result.totalPoints;
            }
        });

        Object.keys(periods).forEach((key) => {
            numbersOfTricksDone.push(periods[key].numberOfTricksDone);
            totalPoints.push(periods[key].totalPoints);
        });

        return res.json({
            labels,
            numbersOfTricksDone,
            totalPoints,
        });
    } catch (error) {
        return next(error);
    }
}

/**
 * Get the percentage of unique validated tricks done by the given Profile
 * @param {boolean} [req.query.validated=true] Check if the tricks need to be validated
 */
async function getPercentageComplete(req, res, next) {
    try {
        const profile = req.object.last().el();
        const { validated } = req.query;

        // Let's query the full list of tricks done by the user
        let results = [];
        if (validated) {
            results = (
                await Media.query({
                    query: {
                        addedBy: profile.id,
                        trickDone: { $exists: true },
                    },
                })
            ).map((media) => media.trickDone);
        } else {
            results = await TrickDone.query({ query: { addedBy: profile.id } });
        }

        // Get the total points possible to do in the app
        const totalPoints = await TrickCtrl.totalPoints();

        if (results.length <= 0) {
            res.json({
                pointsDone: 0,
                totalPoints,
                percentage: 0,
            });
            return;
        }

        // Let's create a list of unique tricks the user has done
        const uniqueTricks = [];
        results.forEach((result) => {
            const t = {
                points: result.totalPoints,
                trick: result.trick,
            };

            if (!exists('trick', result.trick, uniqueTricks)) {
                uniqueTricks.push(t);
            }
        });

        // Thanks to the list, we now can know how much points he did
        let pointsDone = 0;
        uniqueTricks.forEach((trick) => {
            pointsDone += trick.points;
        });

        // Percentage of points done on the total possible
        const percentage = (pointsDone / totalPoints) * 100;

        res.json({
            lastTrickDone: results[0].createdAt,
            pointsDone,
            totalPoints,
            percentage: precisionRound(percentage, percentage < 1 ? 1 : 0),
        });
    } catch (error) {
        next(error);
    }
}

export default {
    load,
    get,
    me,
    update,
    uploadProfilePicture,
    uploadBanner,
    uploadProfilePictureAndBanner,
    list,
    follow,
    unfollow,
    feed,
    medias,
    spots,
    sessions,
    skated,
    clips,
    tricksDone,
    search,
    pointsGraph,
    getPercentageComplete,
};
