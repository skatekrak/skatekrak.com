import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';

import spotCtrl from '../controllers/spots';
import defaultValidations from '../helpers/default-validations';
import { Obstacle, Status, Types } from '../models/spot';
import auth from '../server/auth';
import commentRoutes from './comments';
import spotEditRoutes from './spot-edits';

const router = express.Router();

const validation = {
    list: {
        query: Joi.object()
            .keys({
                limit: Joi.number().positive(),
                newer: Joi.date().iso(),
                older: Joi.date().iso(),
                with: Joi.array().items(Joi.string().valid('comments', '-comments')),
                tags: Joi.array().items(Joi.string()),
            })
            .xor('newer', 'older'),
    },
    listByTags: {
        query: Joi.object().keys({
            limit: Joi.number().positive(),
            tags: Joi.array()
                .items(Joi.string())
                .min(1)
                .required(),
            /// If true, the tags will be searched in the media of the spot
            tagsFromMedia: Joi.boolean().default(false),
        }),
    },
    create: {
        body: {
            name: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            type: Joi.string()
                .valid(Object.values(Types))
                .required(),
            status: Joi.string().valid(Object.values(Status)),
            phone: Joi.string(),
            website: Joi.string().uri(),
            instagram: Joi.string(),
            snapchat: Joi.string(),
            facebook: Joi.string(),
            description: Joi.string(),
            indoor: Joi.bool().required(),
            tags: Joi.array().items(Joi.string()),
            obstacles: Joi.array()
                .unique()
                .items(Joi.string().valid(Object.values(Obstacle))),
        },
    },
    update: {
        query: {
            editId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        },
        body: Joi.object()
            .keys({
                name: Joi.string(),
                latitude: Joi.number(),
                longitude: Joi.number(),
                type: Joi.string().valid(Object.values(Types)),
                status: Joi.string().valid(Object.values(Status)),
                phone: Joi.string().allow('', null),
                website: Joi.string()
                    .uri()
                    .allow('', null),
                instagram: Joi.string().allow('', null),
                snapchat: Joi.string().allow('', null),
                facebook: Joi.string().allow('', null),
                description: Joi.string().allow('', null),
                indoor: Joi.bool(),
                tags: Joi.array().items(Joi.string()),
                obstacles: Joi.array()
                    .unique()
                    .items(Joi.string().valid(Object.values(Obstacle))),
            })
            .and('latitude', 'longitude'),
    },
    search: {
        query: Joi.object()
            .keys({
                limit: Joi.number().positive(),
                query: Joi.string(),
                clustering: Joi.boolean().default(false),
                zoomFactor: Joi.number().default(4),
                spotsPerCluster: Joi.number().default(200),
                northEastLatitude: Joi.number(),
                northEastLongitude: Joi.number(),
                southWestLatitude: Joi.number(),
                southWestLongitude: Joi.number(),
                geojson: Joi.boolean().default(false),
                filters: Joi.object()
                    .keys({
                        indoor: Joi.boolean(),
                        type: Joi.array().items(Joi.string().valid(Object.values(Types))),
                        status: Joi.array().items(Joi.string().valid(Object.values(Status))),
                    })
                    .unknown(false)
                    .default({}),
            })
            .without('query', ['northEastLatitude', 'northEastLongitude', 'southWestLatitude', 'southWestLongitude'])
            .and(['northEastLatitude', 'northEastLongitude', 'southWestLatitude', 'southWestLongitude'])
            .xor('query', 'northEastLatitude'),
    },
    geoJSON: {
        query: Joi.object().keys({
            northEastLatitude: Joi.number(),
            northEastLongitude: Joi.number(),
            southWestLatitude: Joi.number(),
            southWestLongitude: Joi.number(),
        }),
    },
    sessions: {
        query: Joi.object()
            .keys({
                limit: Joi.number().positive(),
                newer: Joi.date().iso(),
                older: Joi.date().iso(),
                userId: Joi.string(),
            })
            .xor('newer', 'older'),
    },
    reverse: {
        query: Joi.object().keys({
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
        }),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    .get(validate(validation.list), auth.logged(), auth.admin(), spotCtrl.list)
    .post(validate(validation.create), auth.logged(), spotCtrl.create);

router.route('/by-tags').get(validate(validation.listByTags), spotCtrl.listByTags);

router.route('/search').get(validate(validation.search), spotCtrl.search);

router.route('/geojson').get(validate(validation.geoJSON), spotCtrl.fetchGeoJSON);

router.route('/reverse').get(validate(validation.reverse), auth.logged(), spotCtrl.reverseGeocoder);

router
    .route('/:objectId')
    .get(auth.logged(), spotCtrl.load, spotCtrl.get)
    .put(validate(validation.update), auth.logged(), spotCtrl.load, auth.addedBy(), spotCtrl.update)
    .delete(auth.logged(), spotCtrl.load, auth.addedBy(), spotCtrl.remove);

router.route('/:objectId/follow').post(auth.logged(), spotCtrl.load, spotCtrl.follow);

router.route('/:objectId/unfollow').post(auth.logged(), spotCtrl.load, spotCtrl.unfollow);

router.route('/:objectId/overview').get(spotCtrl.load, spotCtrl.overview);

router.route('/:objectId/medias').get(validate(defaultValidations.feed), spotCtrl.load, spotCtrl.medias);

router.route('/:objectId/sessions').get(validate(validation.sessions), auth.logged(), spotCtrl.load, spotCtrl.sessions);

router.route('/:objectId/whoskatehere').get(auth.logged(), spotCtrl.load, spotCtrl.whoSkateHere);

router.route('/:objectId/clips').get(validate(defaultValidations.feed), spotCtrl.load, spotCtrl.clips);

router
    .route('/:objectId/tricks-done')
    .get(validate(defaultValidations.feed), auth.logged(), spotCtrl.load, spotCtrl.tricksDone);

router.use('/:objectId/comments', auth.logged(), spotCtrl.load, commentRoutes);

router.use('/:objectId/edits', auth.logged(), spotCtrl.load, spotEditRoutes);

export default router;
