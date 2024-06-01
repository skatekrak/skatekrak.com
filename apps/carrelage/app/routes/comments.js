import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';
import commentCtrl from '../controllers/comments';
import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';
import likeRoutes from './likes';

const router = express.Router();

const validation = {
    create: {
        body: Joi.object({
            content: Joi.string().required(),
        }),
    },
    update: {
        body: Joi.object({
            content: Joi.string().required(),
        }),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    /** POST /comments - Create new comment */
    .post(validate(validation.create), commentCtrl.create);

router
    .route('/:objectId')
    /** GET /comments/:commentId - Get comment */
    .get(commentCtrl.load, commentCtrl.get)

    /** PUT /comments/:commentId - Update existings comment */
    .put(validate(validation.update), commentCtrl.load, auth.addedBy(), commentCtrl.update)

    /** DELETE /comments/:commentId - Delete existings comment */
    .delete(commentCtrl.load, auth.addedBy(), commentCtrl.remove);

router.use('/:objectId/likes', commentCtrl.load, likeRoutes);

export default router;
