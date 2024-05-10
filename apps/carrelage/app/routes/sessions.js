import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';

import auth from '../server/auth';
import sessionCtrl from '../controllers/sessions';
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
            caption: Joi.string(),
            spots: Joi.array()
                .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
                .min(1)
                .required(),
            with: Joi.array().items(Joi.string().regex(/^[a-z0-9_]{1,15}$/)),
            when: Joi.date().required(),
        },
    },
    update: {
        body: {
            caption: Joi.string().allow('', null),
            spots: Joi.array()
                .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
                .min(1),
            with: Joi.array().items(Joi.string().regex(/^[a-z0-9_]{1,15}$/)),
            when: Joi.date(),
        },
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    /** GET /sessions - Get list of sessions */
    .get(validate(validations.list), auth.logged(), auth.admin(), sessionCtrl.list)

    /** POST /sessions - Create new sessions */
    .post(validate(validations.create), auth.logged(), sessionCtrl.create);

router
    .route('/:objectId')
    /** GET /sessions/:objectId - Get session */
    .get(auth.logged(), sessionCtrl.load, sessionCtrl.get)

    /** PATCH /sessions/:objectId - Update existing session */
    .patch(validate(validations.update), auth.logged(), sessionCtrl.load, auth.addedBy(), sessionCtrl.update)

    /** DELETE /sessions/:objectId - Delete session */
    .delete(auth.logged(), sessionCtrl.load, auth.addedBy(), sessionCtrl.remove);

router.use('/:objectId/comments', auth.logged(), sessionCtrl.load, commentRoutes);

router.use('/:objectId/likes', auth.logged(), sessionCtrl.load, likeRoutes);

export default router;
