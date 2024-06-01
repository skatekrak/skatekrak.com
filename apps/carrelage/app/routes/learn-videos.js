import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import auth from '../server/auth';
import learnVideoCtrl from '../controllers/learn-videos';
import defaultValidations from '../helpers/default-validations';
import commentRoutes from './comments';
import likeRoutes from './likes';

const router = express.Router();

const validations = {
    list: {
        query: Joi.object({
            limit: Joi.number().positive(),
            skip: Joi.number(),
        }),
    },
    create: {
        body: Joi.object({
            url: Joi.string().uri().required(),
        }),
    },
    update: {
        body: Joi.object({
            title: Joi.string(),
            description: Joi.string().allow('', null),
            thumbnailURL: Joi.string().uri(),
            trick: Joi.string(),
        }),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    /** GET /learn-videos - Get list of Learn Videos */
    .get(learnVideoCtrl.list)

    /** POST /learn-videos - Create a new Learn video */
    .post(validate(validations.create), auth.moderator(), learnVideoCtrl.create);

router
    .route('/:objectId')
    /** GET /learn-videos/:objectId - Get Learn Video */
    .get(learnVideoCtrl.load, learnVideoCtrl.get)

    /** PATCH /learn-videos/:objectId - Update existing learn video */
    .patch(validate(validations.update), learnVideoCtrl.load, auth.moderator(), learnVideoCtrl.update)

    /** DELETE /learn-videos/:objectId - Delete learn video */
    .delete(learnVideoCtrl.load, auth.moderator(), learnVideoCtrl.remove);

router.use('/:objectId/comments', learnVideoCtrl.load, commentRoutes);

router.use('/:objectId/likes', learnVideoCtrl.load, likeRoutes);

export default router;
