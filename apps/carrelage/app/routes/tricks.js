import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';

import auth from '../server/auth';
import multer from '../helpers/multer';
import trickCtrl from '../controllers/tricks';
import learnVideoRoutes from './learn-videos';
import defaultValidations from '../helpers/default-validations';
import { DifficultyLevels } from '../models/trick';

const router = express.Router();

const validation = {
    trickId: {
        params: {
            trickId: Joi.string().required(),
        },
    },
    create: {
        body: {
            name: Joi.string().required(),
            displayName: Joi.string().required(),
            order: Joi.number().required(),
            difficultyLevel: Joi.string()
                .valid(Object.values(DifficultyLevels))
                .required(),
            keywords: Joi.array()
                .items(Joi.string())
                .required(),
            points: Joi.number().required(),
        },
    },
    update: {
        body: {
            displayName: Joi.string(),
            order: Joi.number(),
            difficultyLevel: Joi.string().valid(Object.values(DifficultyLevels)),
            keywords: Joi.array().items(Joi.string()),
            points: Joi.number(),
        },
    },
    search: {
        query: {
            query: Joi.string().required(),
            limit: Joi.number().positive(),
        },
    },
};

router.param('trickId', validate(validation.trickId));

router
    .route('/')
    /** GET /tricks - Get list of tricks */
    .get(auth.logged(), trickCtrl.list)

    /** POST /tricks - Create a new trick */
    .post(validate(validation.create), auth.logged(), auth.moderator(), trickCtrl.create);

router.route('/search').get(validate(validation.search), trickCtrl.search);

router
    .route('/:trickId')
    /** GET /tricks/:objectId - Get trick */
    .get(auth.logged(), trickCtrl.load, trickCtrl.get)

    /** PATCH /tricks/:objectId - Update existing trick */
    .patch(validate(validation.update), auth.logged(), trickCtrl.load, auth.moderator(), trickCtrl.update)

    /** DELETE /trick/:objectId - Delete trick */
    .delete(auth.logged(), trickCtrl.load, auth.moderator(), trickCtrl.remove);

router
    .route('/:trickId/medias')
    /** GET /tricks/:objectId/medias - Get medias on this trick */
    .get(validate(defaultValidations.feed), auth.logged(), trickCtrl.load, trickCtrl.medias);

router
    .route('/:trickId/tricks-done')
    /** GET /tricks/:objectId/tricks-done - Get trickDone on this trick */
    .get(validate(defaultValidations.feed), auth.logged(), trickCtrl.load, trickCtrl.tricksDone);

router
    .route('/:trickId/upload')
    .put(auth.logged(), trickCtrl.load, auth.moderator(), multer.single('file'), trickCtrl.upload);

router.use('/:trickId/learn-videos', auth.logged(), trickCtrl.load, learnVideoRoutes);

export default router;
