import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';

import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';
import multer from '../helpers/multer';
import mediaCtrl from '../controllers/medias';
import { Terrains, TrickStances, BodyVarial, Shifty, OneFooted, Grabs } from '../models/trick';

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
                with: Joi.array().items(Joi.string().valid('comments', '-comments')),
                hashtag: Joi.string(),
                nonReleased: Joi.bool().default(false),
            })
            .xor('newer', 'older'),
    },
    create: {
        body: Joi.object({
            caption: Joi.string(),
            spot: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            releaseDate: Joi.date().iso(),
            trickDone: Joi.object({
                trick: Joi.string().required(),
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
        }),
    },
    update: {
        body: Joi.object({
            caption: Joi.string().allow('', null),
            spot: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            releaseDate: Joi.date().iso(),
            trickDone: Joi.object({
                trick: Joi.string().required(),
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
            }).allow(null),
        }),
    },
    search: {
        query: Joi.object({
            query: Joi.string().required(),
            limit: Joi.number().positive(),
        }),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    /** GET /medias - Get list of medias */
    .get(validate(validations.list), auth.loadUser(), mediaCtrl.list)

    /** POST /medias - Create new media */
    .post(validate(validations.create), auth.logged(), mediaCtrl.create);

router
    .route('/search')
    /** GET /medias/search - Search medias */
    .get(validate(validations.search), auth.logged(), mediaCtrl.search);

router.route('/form_upload').post(auth.logged(), auth.moderator(), multer.single('file'), mediaCtrl.formDataUpload);

router
    .route('/:objectId')
    /** GET /medias/:objectId - Get media */
    .get(mediaCtrl.load, mediaCtrl.get)

    /** PATCH /medias/:objectId - Update existing media */
    .patch(validate(validations.update), auth.logged(), mediaCtrl.load, auth.addedBy(), mediaCtrl.update)

    /** DELETE /media/:objectId -  Delete media */
    .delete(auth.logged(), mediaCtrl.load, auth.addedBy(), mediaCtrl.remove);

router
    .route('/:objectId/upload')
    /** PUT /medias/:objectId/upload - Upload a media content */
    .put(auth.logged(), mediaCtrl.load, auth.addedBy(), multer.single('file'), mediaCtrl.uploadMedia);

router.use('/:objectId/comments', auth.logged(), mediaCtrl.load, commentRoutes);

router.use('/:objectId/likes', auth.logged(), mediaCtrl.load, likeRoutes);

export default router;
