import Airtable from 'airtable';
import async from 'async';
import httpStatus from 'http-status';

import config from '../server/config';
import logger from '../server/logger';
import scripts from '../models/scripts/index';

import Trick from '../models/trick';
import Token from '../models/token';
import Media from '../models/media';
import Spot from '../models/spot';
import Session from '../models/session';
import Clip from '../models/clip';
import { spotIndex } from '../helpers/algolia';
import User from '../models/user';

function check(req, res) {
    res.json({ message: 'OK' });
}

function listUsernameTokens(req, res, next) {
    const { userId } = req.params;
    Token.list(userId)
        .then((tokens) => res.json(tokens))
        .catch((e) => next(e));
}

function revokeAllTokens(req, res, next) {
    const { userId } = req.params;
    Token.removeAllFrom(userId)
        .then((raw) => res.json(raw))
        .catch((e) => next(e));
}

function importTricksFromAirtable(req, res, next) {
    /**
     * Import tricks from Airtable
     */
    const base = new Airtable({ apiKey: config.AIRTABLE_KEY }).base(config.AIRTABLE_APP_ID);

    let order = 0;
    const errors = [];

    const { formula } = req.body;
    base('Tricks')
        .select({
            view: 'Grid view',
            filterByFormula: formula,
        })
        .eachPage(
            (records, fetchNextPage) => {
                logger.debug('Got', records.length, 'tricks');
                async.everySeries(
                    records,
                    (record, callback) => {
                        const trick = new Trick({
                            _id: record.get('Hashtag'),
                            hashtag: `#${record.get('Hashtag')}`,
                            name: record.get('Name').toLowerCase(),
                            difficultyLevel: record.get('Difficulty').toLowerCase(),
                            keywords: record
                                .get('Keywords')
                                .split(',')
                                .map((k) => k.trim()),
                            points: record.get('Points'),
                            order,
                        });

                        order += 1;

                        trick
                            .save()
                            .then((savedTrick) => {
                                logger.debug('Trick', savedTrick.name, 'added');
                                callback(null, true);
                            })
                            .catch((e) => {
                                logger.error('Error adding trick', record.get('Name'), e);
                                errors.push({
                                    name: record.get('Name'),
                                    error: e,
                                });
                                callback(null, true);
                            });
                    },
                    (err, result) => {
                        if (err && !result) {
                            logger.error('Error async', err);
                        } else {
                            logger.debug('fetchNextPage');
                            fetchNextPage();
                        }
                    },
                );
            },
            (err) => {
                logger.debug('Done');
                if (err) {
                    next(err);
                } else if (errors.length > 0) {
                    res.status(httpStatus.BAD_REQUEST);
                } else {
                    res.sendStatus(200);
                }
            },
        );
}

async function applyDBScript(req, res) {
    res.json({ message: 'Triggered' });
    const { script } = req.query;
    if (scripts[script]) {
        try {
            await scripts[script](req.query);
            logger.info(`Migration script ${script} succeed`);
        } catch (err) {
            logger.error(`Migration script ${script} failed`, err);
        }
    } else {
        logger.warn(`Migration script ${script} doesn't exist`);
    }
}

async function addedByNull(req, res) {
    const query = { addedBy: null };
    switch (req.query.object) {
        case 'media':
            res.json(await Media.find(query).exec());
            break;
        case 'spot':
            res.json(await Spot.find(query).exec());
            break;
        case 'session':
            res.json(await Session.find(query).exec());
            break;
        case 'clip':
            res.json(await Clip.find(query).exec());
            break;
        default:
            res.json([]);
            break;
    }
}

async function createAlgoliaSpotIndex(req, res) {
    const cursor = Spot.find().cursor();
    const algoliaSpots = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        algoliaSpots.push({
            objectID: doc._id,
            name: doc.name,
            coverURL: doc.coverURL,
            type: doc.type,
            status: doc.status,
            indoor: doc.indoor,
            tags: doc.tags,
            obstacles: doc.obstacles,
            mediaStat: doc.mediasStat,
            clipsStat: doc.clipsStat,
            facebook: doc.facebook,
            instagram: doc.instagram,
            snapchat: doc.snapchat,
            website: doc.website,
            location: doc.location,
            _geoloc: {
                lat: doc.geo[1],
                lng: doc.geo[0],
            },
        });
    }
    res.json({ message: 'Will save', spots: algoliaSpots.length });
    await spotIndex.saveObjects(algoliaSpots);
}

async function recomputeStats(req, res) {
    const cursor = Spot.find().cursor();
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        await doc.computeMediasStat();
        await doc.computeClipsStat();
        await doc.computeTricksDoneStat();
        await doc.save();
    }

    res.json({ message: 'Computed' });
}

async function updateSubscriptionOfUser(req, res) {
    const { userId, status, subscriptionEndAt, stripeCustomerId } = req.body;

    const user = await User.findById(userId);
    user.subscriptionStatus = status;
    user.subscriptionEndAt = subscriptionEndAt;

    if (stripeCustomerId != null) {
        user.stripeCustomerId = stripeCustomerId;
    }

    const savedUser = await user.save();
    res.json(savedUser);
}

async function getConfig(req, res) {
    res.json(config);
}

async function getStats(req, res) {
    const { from, to } = req.query;
    const spots = await Spot.countDocuments({
        createdAt: { $gte: from.getTime(), $lt: to.getTime() },
    }).exec();

    const media = await Media.countDocuments({
        createdAt: { $gte: from.getTime(), $lt: to.getTime() },
    }).exec();

    res.json({
        spots,
        media,
    });
}

export default {
    check,
    listUsernameTokens,
    revokeAllTokens,
    applyDBScript,
    importTricksFromAirtable,
    addedByNull,
    createAlgoliaSpotIndex,
    recomputeStats,
    updateSubscriptionOfUser,
    getConfig,
    getStats,
};
