import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import clipsCtrl from '../controllers/clips';
import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';
import commentRoutes from './comments';
import likeRoutes from './likes';

const router = express.Router();

const validations = {
    list: {
        query: Joi.object()
            .keys({
                limit: Joi.number().positive(),
                newer: Joi.date().iso(),
                older: Joi.date().iso(),
            })
            .xor('newer', 'older'),
    },
    create: {
        body: {
            url: Joi.string().required(),
            spot: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        },
    },
    update: {
        body: {
            title: Joi.string(),
            description: Joi.string().allow('', null),
            thumbnailURL: Joi.string().uri(),
            spot: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        },
    },
    videoInformation: {
        query: {
            url: Joi.string()
                .uri()
                .required(),
        },
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    /** GET /clips - Get list of clips */
    .get(validate(validations.list), auth.logged(), auth.admin(), clipsCtrl.list)

    /** POST /clips - Create new clip */
    .post(validate(validations.create), auth.logged(), clipsCtrl.create);

router.route('/information').get(auth.logged(), validate(validations.videoInformation), clipsCtrl.videoInformation);

router
    .route('/:objectId')
    /** GET /clips/:clipId - Get clip */
    .get(clipsCtrl.load, clipsCtrl.get)

    /** PATCH /clips/:clipId - Update existing clip */
    .patch(validate(validations.update), auth.logged(), clipsCtrl.load, auth.addedBy(), clipsCtrl.update)

    /** DELETE /clips/:clipId - Delete clip */
    .delete(auth.logged(), clipsCtrl.load, auth.addedBy(), clipsCtrl.remove);

router.use('/:objectId/comments', auth.logged(), clipsCtrl.load, commentRoutes);

router.use('/:objectId/likes', auth.logged(), clipsCtrl.load, likeRoutes);

export default router;
