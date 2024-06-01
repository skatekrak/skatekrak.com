import { isPast } from 'date-fns';
import GoogleMapsAPI from 'googlemaps';
import got from 'got';
import httpStatus from 'http-status';

import Session from '../models/session';
import Spot from '../models/spot';
import logger from '../server/logger';
import config from '../server/config';
import gStorage from '../helpers/gstorage';
import APIError from '../helpers/api-error';
import Notification from '../models/notification';

// Google maps init
const publicConfig = {
    key: config.GOOGLE_KEY,
    stagger_time: 1000,
    encode_polylines: false,
    secure: true,
};

const gmAPI = new GoogleMapsAPI(publicConfig);

/**
 * Load session and append to req
 */
function load(req, res, next) {
    Session.get(req.params.objectId)
        .then((session) => {
            req.object.push(session);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get Session
 * @return {Session}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Generate and upload to S3 a static map with markers representing the spots
 * @param {String[]} spots - List of spot ids to be marked
 * @param {String} covername - filename of the picture
 * @return {Promise<String, Error>}
 */
export async function generateAndUploadStaticMap(spots, covername) {
    const params = {
        size: '640x640',
        maptype: 'roadmap',
        markers: [],
        style: [{ feature: 'road', element: 'all', rules: { hue: '0x00ff00' } }],
    };

    if (config.NODE_ENV !== 'development') {
        // Add a marker for each session's spots
        return Spot.fetch(spots)
            .then((spotsRes) => spotsRes.map((spot) => spot.toObject()))
            .then((values) => {
                if (values.length > 0) {
                    return values.map((v) => ({
                        location: `${v.location.latitude},${v.location.longitude}`,
                        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600',
                    }));
                }
                return Promise.reject(new APIError(['No such spot exists'], httpStatus.NOT_FOUND));
            })
            .then((markers) => {
                params.markers = markers;
                return markers;
            })
            .then(() => got.stream(gmAPI.staticMap(params)))
            .then((stream) => gStorage.uploadToGCloud(stream, 'sessions', covername));
    }

    return gStorage.uploadToGCloud(null, 'sessions', covername);
}

/**
 * Create new session
 * @property {string} req.body.caption - Small description of the session
 * @property {string[]} req.body.spots - List of the spots skated during the session
 * @return {Session}
 */
function create(req, res, next) {
    const session = new Session({
        _caption: req.body.caption,
        addedBy: req.user.id,
        when: req.body.when,
    });

    // Allow to override createdAt in dev
    if (config.NODE_ENV === 'development' && req.body.createdAt && isPast(req.body.createdAt)) {
        session.createdAt = req.body.createdAt;
    }

    // Let's make sure there is no duplicate
    // req.body.spots.forEach(spot => session.spots.addToSet(spot));
    session.spots = [...new Set(req.body.spots)];
    session.with = [...new Set(req.body.with)];
    session.when = new Date(req.body.when);
    session.extractHashtagsMentions();

    logger.debug('session before save', session);

    generateAndUploadStaticMap(session.spots, session.getFilename())
        .then((url) => {
            session.coverURL = url;

            session.with.forEach((user) => {
                Notification.push(req.user.id, user, 'with', [session])
                    .then((savedNotification) => {
                        logger.info('saved notification', savedNotification);
                    })
                    .catch((e) => logger.error(e));
            });

            session.usertags.forEach((user) => {
                Notification.push(req.user.id, user, 'mention', [session])
                    .then((savedNotification) => {
                        logger.info('saved notification', savedNotification);
                    })
                    .catch((e) => logger.error(e));
            });

            return session.save();
        })
        .then((savedSession) => res.json(savedSession))
        .catch((e) => next(e));
}

/**
 * Update existing session
 * @property {string} req.body.caption - New caption of the session
 * @property {string[]} req.body.spots - New full list of spots skated during the session
 * @return {Sessions}
 */
function update(req, res, next) {
    const session = req.object.last().el();

    if (req.body.caption) {
        session._caption = req.body.caption;
    }

    if (req.body.when) {
        session.when = req.body.when;
    }

    if (req.body.with) {
        session.with = [...new Set(req.body.with)];
    }

    if (req.body.spots) {
        // Let's make sure there is no duplicate
        session.spots = [...new Set(req.body.spots)];

        generateAndUploadStaticMap(session.spots, session.getFilename())
            .then(() => session.save())
            .then((savedSession) => res.json(savedSession))
            .catch((e) => next(e));
    } else {
        session
            .save()
            .then((savedSession) => res.json(savedSession))
            .catch((e) => next(e));
    }
}

/**
 * List sessions
 * @property {number} req.query.skip - Numbers of sessions to be skipped
 * @property {number} req.query.limit - Limit of sessions to be returned
 * @returns {Session[]}
 */
function list(req, res, next) {
    const { limit = 20, newer, older } = req.query;

    Session.list(limit, newer, older)
        .then((sessions) => res.json(sessions))
        .catch((e) => next(e));
}

/**
 * Delete session
 * @return {Session}
 */
function remove(req, res, next) {
    const session = req.object.last().el();

    gStorage
        .deleteFromGCloud('sessions', session.getFilename())
        .then(() => session.remove())
        .then((deletedSession) => res.json(deletedSession))
        .catch((e) => next(e));
}

export default {
    load,
    get,
    create,
    update,
    list,
    remove,
};
