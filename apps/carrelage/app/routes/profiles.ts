import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import defaultValidations from '../helpers/default-validations';
import multer from '../helpers/multer';
import auth from '../server/auth';

import rewardRoutes from './rewards';
import trickWishRoutes from './tricks-wish';

import profileCtrl from '../controllers/profiles';

import { Stances } from '../models/profile';

const router = express.Router();

const validations = {
    list: {
        query: Joi.object({
            limit: Joi.number().positive(),
            skip: Joi.number(),
        }),
    },
    update: {
        body: Joi.object({
            stance: Joi.string().valid(...Object.values(Stances)),
            snapchat: Joi.string().allow('', null),
            instagram: Joi.string().allow('', null),
            location: Joi.string().allow('', null),
            sponsors: Joi.array(),
            website: Joi.string().allow('', null),
            description: Joi.string().allow('', null),
            gears: Joi.object()
                .keys({
                    trucks: Joi.string().allow('', null),
                    hardware: Joi.string().allow('', null),
                    wheels: Joi.string().allow('', null),
                    grip: Joi.string().allow('', null),
                    bearings: Joi.string().allow('', null),
                    deck: Joi.string().allow('', null),
                })
                .unknown(false),
        }).unknown(false),
    },
    search: {
        query: Joi.object({
            query: Joi.string().required(),
            limit: Joi.number().positive(),
        }),
    },
    points: {
        query: Joi.object({
            period: Joi.string().valid('month', 'week', 'day').default('week'),
            from: Joi.date().iso().required(),
            to: Joi.date().iso().required(),
            validated: Joi.boolean().default(true),
        }),
    },
    percentage: {
        query: Joi.object({
            validated: Joi.boolean().default(true),
        }),
    },
    medias: {
        query: Joi.object({
            trickDone: Joi.boolean(),
        }),
    },
};

router.param('userId', validate(defaultValidations.userId));

router
    .route('/')
    /** GET /profiles - Get list of profiles */
    .get(validate(validations.list), auth.logged(), auth.admin(), profileCtrl.list);

router.route('/me').get(auth.logged(), profileCtrl.me);

router
    .route('/search')
    /** GET /profiles/search - Search profiles */
    .get(validate(validations.search), auth.logged(), profileCtrl.search);

router
    .route('/:userId')
    /** GET /profiles/:userId - Get profile */
    .get(auth.logged(), profileCtrl.load, profileCtrl.get)

    /** PUT /profiles/:userId- Update profile */
    .put(validate(validations.update), auth.logged(), profileCtrl.load, auth.owner(), profileCtrl.update);

router
    .route('/:userId/upload/profile')
    /** PUT /profiles/:userId/upload/profile - Upload a new profile picture */
    .put(auth.logged(), profileCtrl.load, auth.owner(), multer.single('file'), profileCtrl.uploadProfilePicture);

router
    .route('/:userId/upload/banner')
    /** PUT /profiles/:userId/upload/banner - Upload a new banner */
    .put(auth.logged(), profileCtrl.load, auth.owner(), multer.single('file'), profileCtrl.uploadBanner);

/** PUT /profiles/:userId/upload - Upload both profile picture and banner */
router
    .route('/:userId/upload')
    .put(
        auth.logged(),
        profileCtrl.load,
        auth.owner(),
        multer.fields([{ name: 'profilePicture' }, { name: 'banner' }]),
        profileCtrl.uploadProfilePictureAndBanner,
    );

router
    .route('/:userId/feed')
    /** GET /profiles/:userId/feed */
    .get(validate(defaultValidations.feed), auth.logged(), profileCtrl.load, profileCtrl.feed);

router
    .route('/:userId/medias')
    /** GET /profiles/:userId/videos - Get video Medias created by a Profile */
    .get(
        validate(defaultValidations.feed),
        validate(validations.medias),
        auth.logged(),
        profileCtrl.load,
        profileCtrl.medias,
    );

router
    .route('/:userId/spots')
    /** GET /profiles/:userId/spots - Get Spots created by a Profile */
    .get(validate(defaultValidations.feed), auth.logged(), profileCtrl.load, profileCtrl.spots);

router
    .route('/:userId/sessions')
    /** GET /profiles/:userId/sessions - Get Sessions created by a Profile */
    .get(validate(defaultValidations.feed), auth.logged(), profileCtrl.load, profileCtrl.sessions);

router.route('/:userId/skated').get(auth.logged(), profileCtrl.load, profileCtrl.skated);

router
    .route('/:userId/clips')
    /** GET /profile/:userId/clips - Get Clips created by a Profile */
    .get(validate(defaultValidations.feed), auth.logged(), profileCtrl.load, profileCtrl.clips);

router
    .route('/:userId/tricks-done')
    /** GET /profiles/:userId/tricks-done - Get tricksDone created by a Profile */
    .get(validate(defaultValidations.feed), auth.logged(), profileCtrl.load, profileCtrl.tricksDone);

router
    .route('/:userId/follow')
    /** POST /profiles/:userId/follow */
    .post(auth.logged(), profileCtrl.load, profileCtrl.follow);

router
    .route('/:userId/unfollow')
    /** POST /profiles/:userId/unfollow */
    .post(auth.logged(), profileCtrl.load, profileCtrl.unfollow);

router
    .route('/:userId/points')
    /** GET /profiles/:userId/points */
    .get(auth.logged(), validate(validations.points), profileCtrl.load, profileCtrl.pointsGraph);

router
    .route('/:userId/percentage')
    /** GET /profiles/:userId/percentage */
    .get(auth.logged(), validate(validations.percentage), profileCtrl.load, profileCtrl.getPercentageComplete);

router.use('/:userId/tricks-wishlist', auth.logged(), profileCtrl.load, auth.owner(), trickWishRoutes);

router.use('/:userId/rewards', auth.logged(), profileCtrl.load, auth.owner(), rewardRoutes);

export default router;
