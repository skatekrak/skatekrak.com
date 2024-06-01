import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';
import installationCtrl from '../controllers/installations';
import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';

const router = express.Router();

const validations = {
    create: {
        body: Joi.object({
            deviceToken: Joi.string().required(),
            version: Joi.string(),
            deviceType: Joi.string().valid('ios', 'android').required(),
            locale: Joi.string().regex(/[a-z]{2}-[A-Z]{2}$/),
            timezone: Joi.string().regex(/[a-zA-Z]+\/[a-zA-Z]+$/),
            channels: Joi.array().items(Joi.string()),
        }),
    },
    update: {
        body: Joi.object({
            locale: Joi.string().regex(/[a-z]{2}-[A-Z]{2}$/),
            version: Joi.string(),
            timezone: Joi.string().regex(/[a-zA-Z]+\/[a-zA-Z]+$/),
            channels: Joi.array().items(Joi.string()),
            badge: Joi.number(),
        }),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    /** POST /installations - Create new installation */
    .post(validate(validations.create), auth.owner(), installationCtrl.create);

router
    .route('/:objectId')
    /** GET /installations/:objectId - Get installation */
    .get(installationCtrl.load, auth.owner(), installationCtrl.get)

    /** PATCH /installations/:objectId - Update existing instalations */
    .patch(validate(validations.update), installationCtrl.load, auth.owner(), installationCtrl.update)

    /** DELETE /installations/:objectId - Delete existinglids  */
    .delete(installationCtrl.load, auth.owner(), installationCtrl.remove);

export default router;
