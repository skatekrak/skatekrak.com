import express from 'express';
import { checkSchema } from 'express-validator/check';

import { throwIfValidationFailed } from '../helpers/default-validations';
import authCtrl from '../controllers/auth';
import tokenCtrl from '../controllers/tokens';
import auth from '../server/auth';

const router = express.Router();

const validations = {
    objectId: {
        objectId: {
            in: ['params'],
            isMongoId: {
                errorMessage: 'ObjectId does not respect the Mongo ObjectId format',
            },
        },
    },
    login: {
        username: {
            in: ['body'],
            isEmpty: {
                negated: true,
                errorMessage: 'Username could not be empty',
            },
        },
        password: {
            in: ['body'],
            isEmpty: {
                negated: true,
                errorMessage: 'Password could not be empty',
            },
        },
        mobile: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
        rememberMe: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
    },
    signup: {
        username: {
            in: ['body'],
            matches: {
                errorMessage: "Username should only contains alphanumeric or '_' characters",
                options: [/^[A-Za-z0-9_]+$/],
            },
            isLength: {
                errorMessage: 'Username length should be between 1 and 15 characters',
                options: { min: 1, max: 15 },
            },
            isLowercase: {
                errorMessage: 'Username should only contains lowercase characters',
            },
        },
        email: {
            in: ['body'],
            isEmail: {
                errorMessage: 'Email is not valid',
            },
        },
        password: {
            in: ['body'],
            isLength: {
                errorMessage: 'Password should at least contains 6 characters',
                options: { min: 6 },
            },
        },
        mobile: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
        rememberMe: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
    },
    fbLogin: {
        accessToken: {
            in: ['body'],
            isEmpty: {
                negated: true,
                errorMessage: 'AccessToken should not be empty',
            },
        },
        mobile: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
        rememberMe: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
    },
    fbsSignup: {
        username: {
            in: ['body'],
            matches: {
                errorMessage: "Username should only contains alphanumeric or '_' characters",
                options: [/^[A-Za-z0-9_]+$/],
            },
            isLength: {
                errorMessage: 'Username length should be between 1 and 15 characters',
                options: { min: 1, max: 15 },
            },
            isLowercase: {
                errorMessage: 'Username should only contains lowercase characters',
            },
        },
        accessToken: {
            in: ['body'],
            isEmpty: {
                negated: true,
                errorMessage: 'AccessToken should not be empty',
            },
        },
        mobile: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
        rememberMe: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
    },
    appleLogin: {
        identifyToken: {
            in: ['body'],
            isEmpty: {
                negated: true,
                errorMessage: 'identifyToken should not be empty',
            },
        },
        mobile: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
        rememberMe: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
    },
    appleSignup: {
        username: {
            in: ['body'],
            matches: {
                errorMessage: "Username should only contains alphanumeric or '_' characters",
                options: [/^[A-Za-z0-9_]+$/],
            },
            isLength: {
                errorMessage: 'Username length should be between 1 and 15 characters',
                options: { min: 1, max: 15 },
            },
            isLowercase: {
                errorMessage: 'Username should only contains lowercase characters',
            },
        },
        identifyToken: {
            in: ['body'],
            isEmpty: {
                negated: true,
                errorMessage: 'AccessToken should not be empty',
            },
        },
        mobile: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
        rememberMe: {
            in: ['body'],
            isBoolean: true,
            optional: true,
        },
    },
    forgotPassword: {
        email: {
            in: ['body'],
            isEmail: {
                errorMessage: 'Email is not valid',
            },
        },
    },
    resetPassword: {
        resetToken: {
            in: ['body'],
            isEmpty: {
                negated: true,
                errorMessage: 'Reset token should not be empty',
            },
        },
        password: {
            in: ['body'],
            isLength: {
                errorMessage: 'Password should at least contains 6 characters',
                options: { min: 6 },
            },
        },
    },
};

router.route('/login').post(checkSchema(validations.login), throwIfValidationFailed(), authCtrl.login);

router.route('/signup').post(checkSchema(validations.signup), throwIfValidationFailed(), authCtrl.signup);

router.route('/logout').post(authCtrl.logout);

router
    .route('/facebook/login')
    .post(checkSchema(validations.fbLogin), throwIfValidationFailed(), authCtrl.loginFacebook);

router
    .route('/facebook/signup')
    .post(checkSchema(validations.fbsSignup), throwIfValidationFailed(), authCtrl.signupFacebook);

router.route('/apple/login').post(checkSchema(validations.appleLogin), throwIfValidationFailed(), authCtrl.loginApple);

router
    .route('/apple/signup')
    .post(checkSchema(validations.appleSignup), throwIfValidationFailed(), authCtrl.signupApple);

router
    .route('/forgot')
    .post(checkSchema(validations.forgotPassword), throwIfValidationFailed(), authCtrl.forgotPassword);

router.route('/reset').post(checkSchema(validations.resetPassword), throwIfValidationFailed(), authCtrl.resetPassword);

router.route('/me').get(auth.logged(), authCtrl.me);

router.route('/session').get(auth.logged(), authCtrl.session);

router.route('/tokens').get(auth.logged(), tokenCtrl.list);

router
    .route('/revoke/:objectId')
    .delete(
        auth.logged(),
        checkSchema(validations.objectId),
        throwIfValidationFailed(),
        tokenCtrl.load,
        tokenCtrl.revoke,
    );

export default router;
