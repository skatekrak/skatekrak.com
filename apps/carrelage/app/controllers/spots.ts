import { isPast } from 'date-fns';
import httpStatus from 'http-status';
import NodeGeocoder from 'node-geocoder';
import GoogleStaticMap from 'google-static-map';
import ngeohash from 'ngeohash';
import { Types as MongoTypes } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

import APIError from '../helpers/api-error';
import config from '../server/config';
import logger from '../server/logger';
import generateSelect from '../helpers/generate-select';
import gStorage from '../helpers/gstorage';
import arrayHelpers from '../helpers/array';
import rewardCtrl from './rewards';

import Media from '../models/media';
import Session from '../models/session';
import Spot, { ILocation, SpotDocument, Status } from '../models/spot';
import Profile from '../models/profile';
import Clip from '../models/clip';
import TrickDone from '../models/trick-done';
import { Timeframes } from '../models/stat';
import SpotEdit from '../models/spot-edit';

export const geocoder = NodeGeocoder({
    provider: 'google',
    httpAdapter: 'https',
    apiKey: config.GOOGLE_KEY,
    language: 'en',
    formatter: {
        format: (data: any) => {
            const address = data[0];
            const location: Partial<ILocation> = {};
            if (address.streetNumber) {
                location.streetNumber = address.streetNumber as string;
            }
            if (address.streetName) {
                location.streetName = address.streetName;
            }
            if (address.city) {
                location.city = address.city;
            } else {
                location.city = address.administrativeLevels.level1long;
            }
            location.country = address.country;
            return location;
        },
    },
});

const gm = GoogleStaticMap.set(config.GOOGLE_KEY);

function genFakeLocation(existing = false): ILocation {
    return {
        streetNumber: '36',
        streetName: existing ? 'FakeStreetUpdate' : 'FakeStreet',
        city: existing ? 'DisconnectUpdate' : 'Disconnect',
        country: existing ? 'OfflineUpdate' : 'Offline',
    };
}

/**
 * Generate and upload to AWS the static map
 */
function generateAndUploadStaticMap(latitude: number, longitude: number, filename: string) {
    if (config.NODE_ENV !== 'development') {
        const stream = gm()
            .address(`${latitude},${longitude}`)
            .zoom(14)
            .resolution('640x640')
            .staticMap()
            .done();
        return gStorage.uploadToGCloud(stream, 'spots', filename);
    }
    return gStorage.uploadToGCloud(null, 'spots', filename);
}

/**
 * Load spot and append to req
 */
function load(req: Request, _res: Response, next: NextFunction) {
    Spot.get(new MongoTypes.ObjectId(req.params.objectId))
        .then((spot) => {
            req.object.push(spot);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get spot
 */
function get(req: Request, res: Response) {
    res.json(req.object.last().el());
}

/**
 * Create new spot
 */
async function create(req: Request, res: Response, next: NextFunction) {
    const spot = new Spot({
        name: req.body.name,
        description: req.body.description,
        addedBy: req.user.id,
        type: req.body.type,
        status: req.body.status,
        phone: req.body.phone,
        website: req.body.website,
        instagram: req.body.instagram,
        snapchat: req.body.snapchat,
        facebook: req.body.facebook,
        openingHours: req.body.openingHours,
        indoor: req.body.indoor,
        tags: req.body.tags,
        obstacles: req.body.obstacles,
    });

    spot.setGeoLoc(req.body.longitude, req.body.latitude);

    // Allow to override createdAt in dev
    if (config.NODE_ENV === 'development' && req.body.createdAt && isPast(req.body.createdAt)) {
        spot.createdAt = req.body.createdAt;
    }

    // Calculate spot.location
    try {
        if (config.NODE_ENV !== 'development') {
            const geocodingResults = await geocoder.reverse({
                lat: req.body.latitude,
                lon: req.body.longitude,
            });
            if (geocodingResults.length > 1) {
                const geoRes = geocodingResults[0];
                spot.location = {
                    streetNumber: geoRes.streetNumber,
                    streetName: geoRes.streetName,
                    city: geoRes.city,
                    country: geoRes.country,
                };
            }
        } else {
            spot.location = genFakeLocation();
        }
    } catch (error) {
        if (error.message === 'Status is ZERO_RESULTS.') {
            next(new APIError(['This spot seems not well located'], httpStatus.BAD_REQUEST));
            return;
        }

        logger.error(error);
    }

    const savedSpot = await spot.save();
    rewardCtrl.checkSpot(req.user.id);
    const profile = await Profile.get(req.user.id);
    profile.spotsFollowing.addToSet(savedSpot._id);
    profile.save();
    res.json(savedSpot);
}

/**
 * Update existing spot
 */
async function update(req: Request, res: Response, next: NextFunction) {
    const spot: SpotDocument = req.object.last().el();

    const { editId } = req.query;
    if (editId) {
        const edit = spot.edits.id(editId);
        if (!edit) {
            return next(new APIError(['No such spot edit'], httpStatus.NOT_FOUND));
        } else if (edit.mergeInto) {
            try {
                const dest = await Spot.get(edit.mergeInto);
                const merged = await spot.mergeInto(dest);
                return res.json(merged);
            } catch (err) {
                return next(err);
            }
        } else {
            req.body = edit;
            await SpotEdit.deleteOne({ _id: editId });
        }
    }

    if (req.body.longitude && req.body.latitude) {
        spot.setGeoLoc(req.body.longitude, req.body.latitude);
    }

    if (req.body.name) {
        spot.name = req.body.name;
    }
    if (req.body.description) {
        spot.description = req.body.description;
    }
    if (req.body.type) {
        spot.type = req.body.type;
    }
    if (req.body.status) {
        spot.status = req.body.status;
    }
    if (req.body.phone) {
        spot.phone = req.body.phone;
    }
    if (req.body.website) {
        spot.website = req.body.website;
    }
    if (req.body.instagram) {
        spot.instagram = req.body.instagram;
    }
    if (req.body.snapchat) {
        spot.snapchat = req.body.snapchat;
    }
    if (req.body.facebook) {
        spot.facebook = req.body.facebook;
    }
    if (req.body.openingHours) {
        spot.openingHours = req.body.openingHours;
    }
    if (req.body.indoor) {
        spot.indoor = req.body.indoor;
    }
    if (req.body.tags) {
        spot.tags = req.body.tags;
    }
    if (req.body.obstacles) {
        spot.obstacles = req.body.obstacles;
    }

    if (req.body.latitude || req.body.longitude) {
        try {
            if (config.NODE_ENV !== 'development') {
                const geocodingResults = await geocoder.reverse({
                    lat: req.body.latitude,
                    lon: req.body.longitude,
                });
                if (geocodingResults.length > 1) {
                    const geoRes = geocodingResults[0];
                    spot.location = {
                        streetNumber: geoRes.streetNumber,
                        streetName: geoRes.streetName,
                        city: geoRes.city,
                        country: geoRes.country,
                    };
                }
            } else {
                spot.location = genFakeLocation(!!spot.location);
            }
        } catch (error) {
            if (error.message === 'Status is ZERO_RESULTS.') {
                return next(new APIError(['This spot seems not well located'], httpStatus.BAD_REQUEST));
            }
            logger.error(error);
        }

        return generateAndUploadStaticMap(req.body.latitude, req.body.longitude, `${spot._id}.png`)
            .then((url) => {
                logger.debug('Will add coverURL', url, spot);
                spot.coverURL = url;
                return spot.save();
            })
            .then((savedSpot) => res.json(savedSpot))
            .catch((e) => next(e));
    }

    return spot
        .save()
        .then((savedSpot) => res.json(savedSpot))
        .catch((e) => next(e));
}

/**
 * Get spot list
 * @returns {Spot[]}
 */
function list(req: Request, res: Response, next: NextFunction) {
    const { limit = 20, newer, older, tags } = req.query;

    const filters = req.query.with || ['comments'];
    const selects = generateSelect(filters, ['-comments']);

    const query: Record<string, unknown> = {};

    if (tags && tags.length > 0) {
        query.tags = { $in: tags };
    }

    Spot.list(limit, newer, older, query, selects)
        .then((spots) => res.json(spots))
        .catch((e) => next(e));
}

function listByTags(req: Request, res: Response, next: NextFunction) {
    const { limit = 2000, tags, tagsFromMedia } = req.query;
    if (tagsFromMedia) {
        Media.aggregate([
            {
                $match: { hashtags: { $in: tags.map((tag: string) => (tag[0] !== '#' ? `#${tag}` : tag)) } },
            },
            {
                $lookup: {
                    from: 'spots',
                    localField: 'spot',
                    foreignField: '_id',
                    as: 'spot_data',
                },
            },
            {
                $unwind: '$spot_data',
            },
            {
                $group: {
                    _id: '$spot_data._id',
                    spot: { $first: '$spot_data' },
                },
            },
            {
                $replaceRoot: { newRoot: '$spot' },
            },
        ])
            .exec()
            .then((spots) =>
                res.json(
                    spots.map((spot) => {
                        const { _id, location, ...spotRes } = spot;

                        return {
                            ...spotRes,
                            id: _id,
                            location: {
                                ...(location ?? {}),
                                latitude: spotRes.geo ? spotRes.geo[1] : null,
                                longitude: spotRes.geo ? spotRes.geo[0] : null,
                            },
                        };
                    }),
                ),
            )
            .catch((e) => next(e));
        return;
    }

    Spot.list(limit, undefined, new Date(), { tags: { $in: tags } })
        .then((spots) => res.json(spots))
        .catch((e) => next(e));
}

/**
 * Delete spot
 */
async function remove(req: Request, res: Response, next: NextFunction) {
    const spot: SpotDocument = req.object.last().el();

    const numberOfMedia = await Media.countDocuments({ spot: spot.id });

    if (numberOfMedia > 0) {
        const err = new APIError(["You't can't delete a spot with medias on it"], httpStatus.UNAUTHORIZED);
        return next(err);
    }

    if (spot.coverURL != null) {
        const chars = spot.coverURL.split('/');
        const filename = chars[chars.length - 1];
        await gStorage.deleteFromGCloud('spots', filename);
    }

    await SpotEdit.deleteOne({ spot: spot._id });
    logger.debug('SpotEdit deleted');
    await Spot.findByIdAndDelete(spot._id);
    logger.debug('Spot deleted');
    res.json(spot);
}

type SpotQueryFilters = { type: string[]; status: string[]; indoor: boolean };
function buildInitialGeoQuery(topRight: [number, number], bottomLeft: [number, number], filters: SpotQueryFilters) {
    const query: Record<string, unknown> = { geo: { $geoWithin: { $box: [bottomLeft, topRight] } } };
    logger.debug('buildInitialGeoQuery', filters);
    if (filters.type) {
        query.type = { $in: filters.type };
    }
    if (filters.status) {
        query.status = { $in: filters.status };
    }
    if (filters.indoor) {
        query.indoor = filters.indoor;
    }
    logger.debug('buildInitialGeoQuery:', query);
    return query;
}

function buildClusterQuery(
    topRight: [number, number],
    bottomLeft: [number, number],
    filters: SpotQueryFilters,
    zoomFactor: number,
    maxSpots: number,
) {
    const blHash = ngeohash.encode(bottomLeft[1], bottomLeft[0], Spot.GEOHASH_LENGTH);
    const urHash = ngeohash.encode(topRight[1], topRight[0], Spot.GEOHASH_LENGTH);
    let commonLength;
    for (commonLength = 0; commonLength < blHash.length; commonLength += 1) {
        if (blHash[commonLength] !== urHash[commonLength]) {
            break;
        }
    }

    logger.debug('Geohashes common length:', commonLength);
    return [
        { $match: buildInitialGeoQuery(topRight, bottomLeft, filters) },
        { $addFields: { geoHash: { $substr: ['$geoHash', 0, commonLength + zoomFactor] }, comments: 0 } },
        {
            $group: {
                _id: '$geoHash',
                latitude: { $avg: { $arrayElemAt: ['$geo', 1] } },
                longitude: { $avg: { $arrayElemAt: ['$geo', 0] } },
                maxLatitude: { $max: { $arrayElemAt: ['$geo', 1] } },
                maxLongitude: { $max: { $arrayElemAt: ['$geo', 0] } },
                minLatitude: { $min: { $arrayElemAt: ['$geo', 1] } },
                minLongitude: { $min: { $arrayElemAt: ['$geo', 0] } },
                count: { $sum: 1 },
                spots: { $push: '$$ROOT' },
            },
        },
        {
            $project: {
                _id: 1,
                latitude: 1,
                longitude: 1,
                count: 1,
                maxLatitude: 1,
                maxLongitude: 1,
                minLatitude: 1,
                minLongitude: 1,
                spots: {
                    $cond: {
                        if: { $lt: ['$count', maxSpots + 1] },
                        then: '$spots',
                        else: [] as any[],
                    },
                },
            },
        },
    ];
}

/**
 * Transform a list of spots to a GEOJson
 * @returns
 */
function formatSpotsToGEOJson(spots: SpotDocument[]) {
    return spots.map((spot) => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: spot.geo,
        },
        properties: {
            id: spot.id,
            name: spot.name,
            type: spot.status === Status.Active ? spot.type : spot.status,
            status: spot.status,
            indoor: spot.indoor,
            tags: spot.tags,
            mediasStat: spot.mediasStat,
        },
    }));
}

/**
 * Take a list of clusters and transform it to a GEOJson cluster
 * @returns
 */
function formatMongoDBClusterToGEOJson(clusters: any) {
    const getClusterType = (cluster: any) => {
        if (cluster.spots.length === 1) {
            return cluster.spots[0].type;
        }
        return undefined;
    };

    return clusters.map((cluster: any) => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [cluster.longitude, cluster.latitude],
        },
        properties: {
            id: cluster.id,
            count: cluster.count,
            type: getClusterType(cluster),
            maxLatitude: cluster.maxLatitude,
            maxLongitude: cluster.maxLongitude,
            minLatitude: cluster.minLatitude,
            minLongitude: cluster.minLongitude,
            /// Radius of the circle
            radius: Math.sqrt(
                Math.pow(cluster.maxLatitude - cluster.minLatitude, 2) +
                    Math.pow(cluster.maxLongitude - cluster.minLongitude, 2),
            ),
            spotId: (() => {
                if (cluster.spots.length === 1) {
                    return cluster.spots[0].id;
                }
                return undefined;
            })(),
        },
    }));
}

/**
 * Search Spots near
 * @property {number} req.query.latitude - Search latitude
 * @property {number} req.query.longitude - Search longitude
 * @property {number} req.query.range - Searching range
 * @property {number} req.query.limit - Max Number of Spots
 * @returns {Spot[]}
 */
function search(req: Request, res: Response, next: NextFunction) {
    const { query } = req.query;
    const { limit = 100, clustering = false, filters, geojson, zoomFactor, spotsPerCluster } = req.query;

    if (query) {
        Spot.search(query, limit)
            .then((spots) => res.json(spots))
            .catch((err) => next(err));
    } else {
        const topRight: [number, number] = [req.query.northEastLongitude, req.query.northEastLatitude];
        const bottomLeft: [number, number] = [req.query.southWestLongitude, req.query.southWestLatitude];
        if (clustering) {
            Spot.aggregate(buildClusterQuery(topRight, bottomLeft, filters, zoomFactor, spotsPerCluster))
                .exec()
                .then((clusters) => {
                    clusters.forEach((clusterRes) => {
                        const cluster = clusterRes;
                        cluster.id = cluster._id;
                        delete cluster._id;
                        // cluster.spots.forEach((spotRes: SpotDocument) => {
                        //     const spot = spotRes;
                        //     spot.id = spot._id;
                        //     delete spot._id;
                        //
                        //     if (spot.location == null) {
                        //         spot.location = {};
                        //     }
                        //
                        //     spot.location.latitude = spot.geo ? spot.geo[1] : null;
                        //     spot.location.longitude = spot.geo ? spot.geo[0] : null;
                        // });
                    });
                    return clusters;
                })
                .then((clusters) => {
                    if (geojson) {
                        res.json(formatMongoDBClusterToGEOJson(clusters));
                    } else {
                        res.json(clusters);
                    }
                })
                .catch((err) => next(err));
        } else {
            Spot.find(buildInitialGeoQuery(topRight, bottomLeft, filters))
                .limit(limit)
                .exec()
                .then((spots) => {
                    if (geojson) {
                        res.json(formatSpotsToGEOJson(spots));
                    } else {
                        res.json(spots);
                    }
                })
                .catch((e) => next(e));
        }
    }
}

function fetchGeoJSON(req: Request, res: Response, next: NextFunction) {
    const topRight = [req.query.northEastLongitude, req.query.northEastLatitude];
    const bottomLeft = [req.query.southWestLongitude, req.query.southWestLatitude];

    Spot.find({
        geoLoc: {
            $geoWithin: {
                $box: [bottomLeft, topRight],
            },
        },
    })
        .then((spots) => {
            res.json(formatSpotsToGEOJson(spots));
        })
        .catch((err) => next(err));
}

/**
 * Follow spot
 * @return {Profile}
 */
async function follow(req: Request, res: Response, next: NextFunction) {
    const spot = req.object.last().el();
    try {
        const profile = await Profile.get(req.user._id);
        profile.spotsFollowing.addToSet(spot._id);
        const saved = await profile.save();
        res.json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Unfollow spot
 * @return {Profile}
 */
async function unfollow(req: Request, res: Response, next: NextFunction) {
    const spot = req.object.last().el();
    try {
        const profile = await Profile.get(req.user._id);
        profile.spotsFollowing.pull(spot._id);
        const saved = await profile.save();
        res.json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Get overview of Spot
 */
async function overview(req: Request, res: Response, next: NextFunction) {
    const spot = req.object.last().el();
    try {
        const [mostLiked, lastMedias, skaters, lastClips] = await Promise.all([
            Media.mostLiked(1, Timeframes.All, { spot: spot._id, type: 'image' }),
            Media.list({ limit: 5, older: new Date(), query: { spot: spot._id } }),
            Session.whoSkateHere(spot._id, 7, null, new Date()),
            Clip.list(5, null, new Date(), { spot: spot._id }),
        ]);
        res.json({
            spot,
            skaters,
            medias: lastMedias,
            clips: lastClips,
            mostLikedMedia: mostLiked[0],
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get the list of people who skated at the spot
 */
function whoSkateHere(req: Request, res: Response, next: NextFunction) {
    const spot = req.object.last().el();
    Session.whoSkateHere(spot._id, 0, null, new Date())
        .then((skaters) => res.json(skaters))
        .catch((e) => next(e));
}

/**
 * Get Medias related to this Spot
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function medias(req: Request, res: Response, next: NextFunction) {
    const spot = req.object.last().el();
    const { limit = 20, newer, older } = req.query;
    Media.list({
        limit,
        newer,
        older,
        query: { spot: spot._id },
    })
        .then((mediasRes) => res.json(mediasRes.map(arrayHelpers.removeReleaseDate)))
        .catch((err) => next(err));
}

/**
 * Get Sessions related to this Spot
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function sessions(req: Request, res: Response, next: NextFunction) {
    const spot = req.object.last().el();
    const { limit = 20, newer, older, userId } = req.query;
    if (userId) {
        Session.list(limit, newer, older, { $or: [{ addedBy: userId }, { with: userId }], spots: spot._id })
            .then((sessionsRes) => res.json(sessionsRes))
            .catch((err) => next(err));
    } else {
        Session.list(limit, newer, older, { spots: spot._id })
            .then((sessionsRes) => res.json(sessionsRes))
            .catch((err) => next(err));
    }
}

/**
 * Get Clips related to this Spot
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function clips(req: Request, res: Response, next: NextFunction) {
    const spot = req.object.last().el();
    const { limit = 20, newer, older } = req.query;
    Clip.list(limit, newer, older, { spot: spot._id })
        .then((clipsRes) => res.json(clipsRes))
        .catch((err) => next(err));
}

/**
 * Get TricksDone created by this Profile
 * @param {Number} [limit=20] - Number of max returned objects
 * @param {Date} [newer] - Select objects newer to this date
 * @param {Date} [older] - Select objects older to this date
 */
function tricksDone(req: Request, res: Response, next: NextFunction) {
    const spot = req.object.last().el();
    const { limit = 20, newer, older } = req.query;
    TrickDone.list({
        limit,
        newer,
        older,
        query: { spot: spot._id },
    })
        .then((tricksDoneRes) => res.json(tricksDoneRes))
        .catch((err) => next(err));
}

async function reverseGeocoder(req: Request, res: Response) {
    const { latitude, longitude } = req.query;
    const response = await geocoder.reverse({
        lat: latitude,
        lon: longitude,
    });
    return res.json(response);
}

export default {
    load,
    get,
    create,
    update,
    list,
    listByTags,
    remove,
    search,
    fetchGeoJSON,
    follow,
    unfollow,
    overview,
    medias,
    sessions,
    clips,
    tricksDone,
    whoSkateHere,
    reverseGeocoder,
};
