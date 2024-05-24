import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';

import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';
import trickDoneCtrl from '../controllers/tricks-done';
import commentRoutes from './comments';
import likeRoutes from './likes';
import { Terrains, TrickStances, BodyVarial, Shifty, OneFooted, Grabs } from '../models/trick';

const router = express.Router();

const validations = {
    list: {
        query: Joi.object()
            .keys({
                limit: Joi.number().positive(),
                newer: Joi.date().iso(),
                older: Joi.date().iso(),
                trick: Joi.string(),
                withMedia: Joi.boolean(),
            })
            .xor('newer', 'older'),
    },
    create: {
        body: Joi.object({
            trick: Joi.string().required(),
            spot: Joi.string(),
            stance: Joi.string()
                .valid(...Object.values(TrickStances))
                .default(TrickStances.Regular),
            terrain: Joi.string()
                .valid(...Object.values(Terrains))
                .required(),
            shifty: Joi.string().valid(...Object.values(Shifty)),
            oneFooted: Joi.string().valid(...Object.values(OneFooted)),
            bodyVarial: Joi.string().valid(...Object.values(BodyVarial)),
            grab: Joi.string().valid(...Object.values(Grabs)),
        }),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    .get(auth.logged(), auth.moderator(), validate(validations.list), trickDoneCtrl.list)
    /** POST /tricks-done - Create a Trick done */
    .post(auth.logged(), validate(validations.create), trickDoneCtrl.create);

router
    .route('/:objectId')
    /** GET /tricks-done/:trickDoneId - Get a trick done */
    .get(auth.logged(), trickDoneCtrl.load, trickDoneCtrl.get)

    /** DELTE /tricks-done/:trickDoneId - Delete a trick done */
    .delete(auth.logged(), trickDoneCtrl.load, auth.addedBy(), trickDoneCtrl.remove);

router.use('/:objectId/comments', auth.logged(), trickDoneCtrl.load, commentRoutes);

router.use('/:objectId/likes', auth.logged(), trickDoneCtrl.load, likeRoutes);

export default router;
