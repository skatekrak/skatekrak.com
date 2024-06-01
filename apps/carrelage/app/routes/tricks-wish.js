import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import trickWishCtrl from '../controllers/tricks-wish';
import { Terrains, TrickStances } from '../models/trick';

const router = express.Router();

const validations = {
    create: {
        body: Joi.object({
            trick: Joi.string().required(),
            stance: Joi.string()
                .valid(...Object.values(TrickStances))
                .default(TrickStances.Regular),
            terrain: Joi.string()
                .valid(...Object.values(Terrains))
                .required(),
            amountWanted: Joi.number().positive(),
        }),
    },
    update: {
        body: Joi.object({
            amountWanted: Joi.number().positive().required(),
        }),
    },
};

router
    .route('/')
    /** POST /profiles/:userId/tricks-wish - Create a new trick in the wishlist */
    .post(validate(validations.create), trickWishCtrl.create)

    /** DELETE /profiles/:userId/tricks-wish - Delete all the tricks in the wishlist */
    .delete(trickWishCtrl.reset);

router
    .route('/:trickWishId')
    /** PATCH /profiles/:userId/tricks-wish/:objectId - Update the trick in the wishlist */
    .patch(validate(validations.update), trickWishCtrl.load, trickWishCtrl.update)

    /** DELETE /profiles/:userId/tricks-wish/:objectId - Remove the trick in the wishlist */
    .delete(trickWishCtrl.load, trickWishCtrl.remove);

export default router;
