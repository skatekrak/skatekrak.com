import passport from 'passport';
import passportBearer from 'passport-http-bearer';
import passportCookie from 'passport-cookie';
import httpStatus from 'http-status';

import APIError from '../helpers/api-error';
import Token from '../models/token';
import logger from './logger';
import config from './config';
import stripe from '../helpers/stripe';
import User from '../models/user';

const BearerStrategy = passportBearer.Strategy;
const CookieStrategy = passportCookie.Strategy;

const INVALID_TOKEN = new APIError(['Your token is invalid'], httpStatus.UNAUTHORIZED);
const WRONG_PERMISSION = new APIError(['You do not have right permission'], httpStatus.FORBIDDEN);

/**
 * Verify that the given token exist and is still valid
 * @param {string} tokenId - Token extracted by passport
 * @param {Function} done - Callback
 */
export async function validToken(tokenId, done) {
    try {
        const token = await Token.getByToken(tokenId);
        if (!token) {
            done(INVALID_TOKEN, false);
            return;
        }

        logger.debug('Token', token.user);
        let isExpired = false;

        if (token.expires) {
            logger.debug('expires at', token.expires);
            const today = new Date();
            isExpired = today >= token.expires;
        }

        if (isExpired) {
            done(INVALID_TOKEN, false);
        } else {
            done(null, {
                token: token.token,
                user: {
                    _id: token.user,
                    id: token.user,
                    role: token.role,
                },
            });
        }
    } catch (err) {
        done(INVALID_TOKEN, false);
    }
}

passport.use(
    new BearerStrategy((token, done) => {
        validToken(token, done);
    }),
);

passport.use(
    new CookieStrategy(
        {
            cookieName: 'bearer',
            signed: true,
        },
        (token, done) => {
            validToken(token, done);
        },
    ),
);

/**
 * Middleware to initialize passport
 */
function initialize() {
    return passport.initialize();
}

export function authenticate(req, res, next) {
    return new Promise((resolve, reject) => {
        passport.authenticate(
            ['bearer', 'cookie'],
            {
                session: false,
            },
            (err, auth) => {
                if (err) {
                    reject(err);
                } else if (!auth) {
                    reject(INVALID_TOKEN);
                } else {
                    req.token = auth.token;
                    req.user = auth.user;
                    resolve(auth.user);
                }
            },
        )(req, res, next);
    });
}

/**
 * Middleware to valid only registered user and vadid token
 */
function logged() {
    return (req, res, next) => {
        authenticate(req, res, next)
            .then(() => next())
            .catch((err) => next(err));
    };
}

/**
 * Middleware to valid registered user and vadid token, otherwise continue
 */
function loadUser() {
    return (req, res, next) => {
        authenticate(req, res, next)
            .then(() => next())
            .catch(() => next());
    };
}

/**
 * Middleware to valid only moderator & admin role user
 */
function moderator() {
    return (req, res, next) => {
        if (req.user) {
            if (req.user.role === 'moderator' || req.user.role === 'admin') {
                next();
            } else {
                next(WRONG_PERMISSION);
            }
        } else {
            next(INVALID_TOKEN);
        }
    };
}

/**
 * Middleware to valid only admin role user
 */
function admin() {
    return (req, res, next) => {
        if (req.user) {
            if (req.user.role === 'admin') {
                next();
            } else {
                next(WRONG_PERMISSION);
            }
        } else {
            next(INVALID_TOKEN);
        }
    };
}

/**
 * Middleware to valid only the author of the object (or moderator & admin)
 */
function addedBy() {
    return (req, res, next) => {
        if (req.user) {
            if (
                req.user.role === 'admin' ||
                req.user.role === 'moderator' ||
                req.object.last().el().addedBy === req.user.id ||
                req.object.last().el().addedBy.id === req.user.id
            ) {
                next();
            } else {
                next(WRONG_PERMISSION);
            }
        } else {
            next(INVALID_TOKEN);
        }
    };
}

/**
 * Middleware to be used on user & profile to check if its the owner (or moderator & admin)
 */
function owner() {
    return (req, res, next) => {
        if (req.user) {
            if (
                req.user.role === 'admin' ||
                req.user.role === 'moderator' ||
                req.object.first().el().id === req.user.id
            ) {
                next();
            } else {
                next(WRONG_PERMISSION);
            }
        } else {
            next(INVALID_TOKEN);
        }
    };
}

/**
 * Check if logged user role is just an user
 * @param {*} req
 */
function isUserOnly(req) {
    return req && req.user && req.user.role === 'user';
}

/**
 * Check if logged user role is moderator or above
 * @param {*} req
 */
function isModerator(req) {
    return req && req.user && (req.user.role === 'moderator' || req.user.role === 'admin');
}

/**
 * Check if logged user role is admin
 * @param {*} req
 */
function isAdmin(req) {
    return req && req.user && req.user.role === 'admin';
}

function isStripe() {
    return (req, res, next) => {
        const sig = req.headers['stripe-signature'];
        logger.debug('stripe signature:', sig);

        try {
            const event = stripe.webhooks.constructEvent(req.rawBody, sig, config.STRIPE_WEBHOOK_SECRET);
            logger.debug('stripe valid');
            req.event = event;
            next();
        } catch (err) {
            logger.error('stripe invalid', err);
            next(new APIError(['Stripe signature or payload invalid'], httpStatus.EXPECTATION_FAILED));
        }
    };
}

/**
 * Check wether or not a user subscription is still valid.
 * User is allowed if their `subscriptionEndAt` is after now
 * and if their `subscriptionStatus` is different from `Expired` or `None`
 */
function isSubscribed() {
    return async (req, res, next) => {
        const user = await User.findById(req.user?.id);

        if (user == null) {
            next(new APIError(['Your token is invalid'], httpStatus.UNAUTHORIZED));
        } else if ((user.role === 'moderator' && user.role === 'admin') || user.isSubscribed()) {
            next();
        } else {
            next(new APIError(['You do not have right permission'], httpStatus.PAYMENT_REQUIRED));
        }
    };
}

function isNotSubscribed() {
    return async (req, res, next) => {
        const user = await User.findById(req.user?.id);

        if (user == null) {
            next(new APIError(['Your token is invalid'], httpStatus.UNAUTHORIZED));
        } else if ((user.role === 'moderator' && user.role === 'admin') || !user.isSubscribed()) {
            next();
        } else {
            next(new APIError(['You do not have right permission'], httpStatus.FORBIDDEN));
        }
    };
}

export default {
    initialize,
    isUserOnly,
    logged,
    loadUser,
    isModerator,
    moderator,
    isAdmin,
    admin,
    addedBy,
    owner,
    isStripe,
    isSubscribed,
    isNotSubscribed,
    WRONG_PERMISSION,
    INVALID_TOKEN,
};
