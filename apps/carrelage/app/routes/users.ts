import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import userCtrl from '../controllers/users';
import defaultValidations from '../helpers/default-validations';
import { Roles } from '../models/user';
import auth from '../server/auth';
import installationRoutes from './installations';

const router = express.Router();

const validations = {
    create: {
        body: Joi.object({
            username: Joi.string()
                .regex(/^[a-z0-9_]{1,15}$/)
                .required(),
            password: Joi.string().required(),
            email: Joi.string().email().required(),
            role: Joi.string()
                .required()
                .valid(...Object.values(Roles)),
        }),
    },
    update: {
        body: Joi.object({
            password: Joi.string(),
            email: Joi.string().email(),
            welcomeEmailSent: Joi.bool(),
            emailVerified: Joi.bool(),
            role: Joi.string().valid(...Object.values(Roles)),
        }),
    },
    list: {
        query: Joi.object({
            limit: Joi.number().positive(),
            skip: Joi.number(),
        }),
    },
    rename: {
        body: Joi.object({
            username: Joi.string()
                .regex(/^[a-z0-9_]{1,15}$/)
                .required(),
            mobile: Joi.boolean().default(true),
            rememberMe: Joi.boolean().default(false),
        }),
    },
    confirmEmail: {
        body: Joi.object({
            token: Joi.string().required(),
        }),
    },
};

router.param('userId', validate(defaultValidations.userId));
// router.param("userId", userCtrl.load);

router
    .route('/')
    /** GET /users - Get list of users */
    .get(validate(validations.list), auth.logged(), auth.admin(), userCtrl.list)

    /** POST /users - Create new user */
    .post(validate(validations.create), auth.logged(), auth.admin(), userCtrl.create);

router.get('/me', auth.logged(), userCtrl.me);

router
    .route('/:userId')
    /** GET /users/:userId - Get user */
    .get(auth.logged(), userCtrl.load, auth.owner(), userCtrl.get)

    /** PUT /users/:userId - Update user */
    .put(validate(validations.update), auth.logged(), userCtrl.load, auth.owner(), userCtrl.update)

    /** DELETE /users/:userId - Delete user */
    .delete(auth.logged(), userCtrl.load, auth.owner(), userCtrl.remove);

router
    .route('/:userId/rename')
    /** POST /users/:userId/rename - Rename user */
    .post(validate(validations.rename), auth.logged(), userCtrl.load, auth.owner(), userCtrl.rename);

router.use('/:userId/installations', auth.logged(), userCtrl.load, installationRoutes);

router.post(
    '/:userId/send-confirmation-email',
    auth.logged(),
    userCtrl.load,
    auth.owner(),
    userCtrl.sendConfirmationEmail,
);

router.post(
    '/:userId/confirm-email',
    auth.logged(),
    validate(validations.confirmEmail),
    userCtrl.load,
    auth.owner(),
    userCtrl.confirmEmail,
);

export default router;
