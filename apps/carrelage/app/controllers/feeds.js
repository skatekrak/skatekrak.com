import Profile from '../models/profile';
import Media from '../models/media';
import Spot from '../models/spot';
import Session from '../models/session';
import Clip from '../models/clip';
import Contest from '../models/contest';
import TrickDone from '../models/trick-done';

import arrayHelpers from '../helpers/array';

function loadProfile(req, res, next) {
    Profile.get(req.user._id, false)
        .then((profile) => {
            req.object.push(profile);
            next();
        })
        .catch((e) => next(e));
}

/**
 * Get live direct feed
 */
function direct(req, res, next) {
    Promise.all([
        Contest.active(5),
        Session.list(5, null, new Date(), { when: { $gt: new Date(new Date().getDate() - 1) } }),
    ])
        .then((objs) => {
            const all = []
                .concat(...objs)
                .sort(arrayHelpers.sortByCreatedAt)
                .slice(0, 3);

            res.json(all);
        })
        .catch((err) => {
            next(err);
        });
}

/**
 * Get live personal feed
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function personal(req, res, next) {
    const profile = req.object.last().el();
    const { limit = 20, newer, older } = req.query;

    const allProfiles = profile.following || [];
    allProfiles.push(profile.id);
    const allSpots = profile.spotsFollowing || [];

    Promise.all([
        Media.list({
            limit,
            newer,
            older,
            query: { $or: [{ addedBy: { $in: allProfiles } }, { spot: { $in: allSpots } }] },
        }),
        Spot.list(limit, newer, older, { addedBy: { $in: allProfiles } }),
        Spot.comments(limit, newer, older, {
            $or: [{ 'comments.addedBy': { $in: allProfiles } }, { _id: { $in: allSpots } }],
        }),
        Clip.list(limit, newer, older, { $or: [{ addedBy: { $in: allProfiles } }, { spot: { $in: allSpots } }] }),
        TrickDone.list({
            limit,
            newer,
            older,
            query: {
                $or: [
                    {
                        addedBy: { $in: allProfiles },
                    },
                    {
                        spot: { $in: allSpots },
                    },
                ],
                media: {
                    $exists: false,
                },
            },
        }),
    ])
        .then((objs) => {
            let all = [].concat(...objs);
            // Remove duplicate elements
            all = all
                .filter((s1, pos, arr) => arr.findIndex((s2) => s2._id === s1._id) === pos)
                .sort(arrayHelpers.sortByCreatedAt)
                .map(arrayHelpers.removeReleaseDate)
                .slice(0, limit);
            res.json(all);
        })
        .catch((err) => {
            next(err);
        });
}

/**
 * Get explore feed
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function explore(req, res, next) {
    const profile = req.object.last().el();
    const { limit = 20, newer, older } = req.query;

    const allProfiles = profile.following || [];
    allProfiles.push(profile.id);
    // Hide donaldduck content
    allProfiles.push('donaldduck');
    const allSpots = profile.spotsFollowing || [];

    Promise.all([
        Media.list({
            limit,
            newer,
            older,
            query: { $and: [{ addedBy: { $nin: allProfiles } }, { spot: { $nin: allSpots } }] },
        }),
        Spot.list(limit, newer, older, { addedBy: { $nin: allProfiles } }),
        Spot.comments(limit, newer, older, {
            $and: [{ 'comments.addedBy': { $nin: allProfiles } }, { _id: { $nin: allSpots } }],
        }),
        Session.list(limit, newer, older, {
            $and: [{ addedBy: { $nin: allProfiles } }, { with: { $nin: allProfiles } }, { spots: { $nin: allSpots } }],
        }),
        Clip.list(limit, newer, older, { $and: [{ addedBy: { $nin: allProfiles } }, { spot: { $nin: allSpots } }] }),
        TrickDone.list({
            limit,
            newer,
            older,
            query: {
                $and: [
                    {
                        addedBy: { $nin: allProfiles },
                    },
                    {
                        spot: { $nin: allSpots },
                    },
                ],
                media: {
                    $exists: false,
                },
            },
        }),
    ])
        .then((objs) => {
            let all = [].concat(...objs);
            // Remove duplicate elements
            all = all
                .filter((s1, pos, arr) => arr.findIndex((s2) => s2._id === s1._id) === pos)
                .sort(arrayHelpers.sortByCreatedAt)
                .map(arrayHelpers.removeReleaseDate)
                .slice(0, limit);
            res.json(all);
        })
        .catch((err) => {
            next(err);
        });
}

export default {
    loadProfile,
    direct,
    personal,
    explore,
};
