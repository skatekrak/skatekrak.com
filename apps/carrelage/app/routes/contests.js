import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';
import multer from '../helpers/multer';
import contestCtrl from '../controllers/contests';

const router = express.Router();

const validations = {
    create: {
        body: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            endDate: Joi.date().required(),
            reward: Joi.string().required(),
        }),
    },
    update: {
        body: Joi.object({
            title: Joi.string(),
            description: Joi.string().allow('', null),
            endDate: Joi.date(),
            reward: Joi.string().allow('', null),
        }),
    },
    medias: {
        query: Joi.object({
            limit: Joi.number().positive(),
            newer: Joi.date().iso(),
            older: Joi.date().iso(),
        }),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    /** GET /contests - Get list of contests */
    .get(auth.logged(), contestCtrl.list)

    /** POST /contests - Create new contest */
    .post(validate(validations.create), auth.logged(), auth.moderator(), contestCtrl.create);

router
    .route('/:objectId')
    /** GET /contests/:objectId - Get a contest */
    .get(auth.logged(), contestCtrl.load, contestCtrl.get)

    /** PATCH /contests/:objectId - Update a contest */
    .patch(validate(validations.update), auth.logged(), contestCtrl.load, auth.moderator(), contestCtrl.update)

    /** DELETE /contests/:objectId - Delete a contest */
    .delete(auth.logged(), contestCtrl.load, auth.moderator(), contestCtrl.remove);

router
    .route('/:objectId/medias')
    /** GET/contests/:objectId/medias */
    .get(validate(validations.medias), auth.logged(), contestCtrl.load, contestCtrl.medias);

router
    .route('/:objectId/upload')
    /** PUT /contests/:objectId/upload - Upload an logo to the contest */
    .put(auth.logged(), contestCtrl.load, auth.moderator(), multer.single('file'), contestCtrl.upload);

export default router;
