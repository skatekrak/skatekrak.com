import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import got from 'got';
import crypto from 'crypto';
import appleSignin from 'apple-signin-auth';

import config from '../server/config';
import logger from '../server/logger';
import User from '../models/user';
import Token from '../models/token';
import Profile from '../models/profile';
import APIError from '../helpers/api-error';
import * as mails from '../helpers/mails';

const COOKIE_CONFIG = {
    httpOnly: true,
    signed: true,
    domain: config.COOKIE_DOMAIN,
    secure: config.NODE_ENV !== 'development', // don't secure the cookie in dev
    sameSite: 'Lax',
    path: '/',
};

/**
 * Send token json for user w/ cookie
 * @argument {string} origin
 * @argument {Object} headers
 * @argument {Response} res
 * @argument {User} user
 * @argument {boolean} isMobile
 * @argument {boolean} rememberMe
 * @argument {Func} next
 * @returns {JSON} token response
 */
function sendTokenResponse(headers, res, user, isMobile, rememberMe, next) {
    const tokenBuffer = crypto.randomBytes(20);
    const usernameBuffer = Buffer.from(user._id);

    const token = new Token({
        token: Buffer.concat([usernameBuffer, tokenBuffer]).toString('base64'),
        user: user._id,
        role: user.role,
    });
    token.setMetadata(headers);

    const cookieConfig = Object.assign({}, COOKIE_CONFIG);

    // We don't set expiration & cookie on mobile
    if (!isMobile) {
        // + 30 days if rememberMe, 24h otherwise
        token.expires = new Date().valueOf() + (rememberMe ? 2592000000 : 86400000);
        cookieConfig.maxAge = rememberMe ? 2592000000 : 86400000;
    }

    token
        .save()
        .then((savedToken) => {
            // And we also send a cookie if not on mobile
            res.cookie('bearer', savedToken.token, cookieConfig);

            res.json({
                message: 'authenticated',
                token: `Bearer ${savedToken.token}`,
                user,
            });
        })
        .catch((err) => {
            next(err);
        });
}

/**
 * Login user
 */
function login(req, res, next) {
    const { username, password, mobile = true, rememberMe = false } = req.body;

    User.findById(username)
        .exec()
        .then((user) => {
            if (user && user.password && bcrypt.compareSync(password, user.password)) {
                return sendTokenResponse(req.headers, res, user, mobile, rememberMe, next);
            }
            const err = new APIError(['Username or password incorrect'], httpStatus.UNAUTHORIZED);
            return Promise.reject(err);
        })
        .catch((err) => next(err));
}

/**
 * Signup user
 */
function signup(req, res, next) {
    const { username, email, password, mobile = true, rememberMe = false } = req.body;

    User.exist(username)
        .then((already) => {
            if (already) {
                const err = new APIError(['This username is already taken'], httpStatus.UNAUTHORIZED);
                return Promise.reject(err);
            }
            return User.existEmail(email);
        })
        .then((already) => {
            if (already) {
                const err = new APIError(['This email is already taken'], httpStatus.UNAUTHORIZED);
                return Promise.reject(err);
            }
            return User.creator(username, password, email);
        })
        .then((user) => {
            sendTokenResponse(req.headers, res, user, mobile, rememberMe, next);
        })
        .catch((err) => next(err));
}

/**
 *
 * @param {string} accessToken - Token given by facebook
 * @return {Promise<String>} - Return {user_id, expiry} of user's token
 */
function checkFacebookToken(accessToken) {
    return got('https://graph.facebook.com/debug_token', {
        query: {
            input_token: accessToken,
            access_token: config.FB_ACCESS_TOKEN,
        },
        json: true,
    }).then((response) => {
        const debugToken = response.body.data;
        logger.debug('Debug data from Facebook', config.FB_APP_NAME, debugToken);

        if (debugToken.error) {
            return Promise.reject(new APIError([debugToken.error.message], httpStatus.BAD_REQUEST));
        }

        if (debugToken.isValid) {
            return Promise.reject(new APIError(['Your token is not valid'], httpStatus.BAD_GATEWAY));
        }

        if (debugToken.app_id !== config.FB_APP_ID) {
            return Promise.reject(new APIError(['Wrong app_id, this token is not for us'], httpStatus.BAD_GATEWAY));
        }

        if (debugToken.application !== config.FB_APP_NAME) {
            const err = new APIError(['Wrong application, this token is not for us'], httpStatus.BAD_GATEWAY);
            return Promise.reject(err);
        }

        return {
            user_id: debugToken.user_id,
            expires_at: debugToken.expires_at,
        };
    });
}

/**
 * Facebook Login
 */
function loginFacebook(req, res, next) {
    const { accessToken, mobile = true, rememberMe = false } = req.body;

    checkFacebookToken(accessToken)
        .then((response) =>
            User.findOne({
                'auth.facebook.user_id': response.user_id,
            }).exec(),
        )
        .then((user) => {
            if (user) {
                return sendTokenResponse(req.headers, res, user, mobile, rememberMe, next);
            }
            return Promise.reject(new APIError(["This user doesn't exist"], httpStatus.NOT_FOUND));
        })
        .catch((e) => next(e));
}

/**
 * Facebook Signup
 */
function signupFacebook(req, res, next) {
    const { username, accessToken, mobile = true, rememberMe = false } = req.body;

    let myself;
    let newUser;
    let accessTokenExpiresAt;

    checkFacebookToken(accessToken)
        .then((response) => {
            accessTokenExpiresAt = new Date(response.expires_at * 1000);

            return User.findOne({
                'auth.facebook.user_id': response.user_id,
            }).exec();
        })
        .then((user) => {
            if (user) {
                return Promise.reject(
                    new APIError(
                        ['You already have a account on Krak with this Facebook account'],
                        httpStatus.UNAUTHORIZED,
                    ),
                );
            }

            return User.exist(username);
        })
        .then((already) => {
            if (already) {
                return Promise.reject(new APIError(['This username is already taken'], httpStatus.UNAUTHORIZED));
            }

            return got('https://graph.facebook.com/me', {
                query: {
                    access_token: accessToken,
                },
            });
        })
        .then((response) => {
            myself = JSON.parse(response.body);

            newUser = new User({
                _id: username,
                email: myself.email,
                auth: {
                    facebook: {
                        user_id: myself.id,
                        access_token: accessToken,
                        expires_at: accessTokenExpiresAt,
                    },
                },
            });

            return newUser.save();
        })
        .then((savedUser) => {
            const newProfile = new Profile();
            newProfile.username = savedUser.id;

            if (myself.location && myself.location.name) {
                newProfile.location = myself.location.name;
            }

            return newProfile.save();
        })
        .then(() => {
            sendTokenResponse(req.headers, res, newUser, mobile, rememberMe, next);
        })
        .catch((e) => next(e));
}

/**
 * Authenticate with Apple
 */
function loginApple(req, res, next) {
    const { identifyToken, mobile = true, rememberMe = false } = req.body;

    let userEmail;

    appleSignin
        .verifyIdToken(identifyToken, {
            audience: ['host.exp.Exponent', 'com.skatekrak.Krak'],
        })
        .then(({ sub: userAppleId, email }) => {
            userEmail = email;

            return User.findOne({
                'auth.apple.apple_id': userAppleId,
            }).exec();
        })
        .then(async (user) => {
            if (user) {
                if (userEmail != null) {
                    user.email = userEmail;
                    user = await user.save();
                }

                return sendTokenResponse(req.headers, res, user, mobile, rememberMe, next);
            }
            return Promise.reject(new APIError(["This user doesn't exist"], httpStatus.NOT_FOUND));
        })
        .catch((e) => next(e));
}

function signupApple(req, res, next) {
    const { username, identifyToken, mobile = true, rememberMe = false } = req.body;

    let userEmail;
    let userAppleId;
    let newUser;

    appleSignin
        .verifyIdToken(identifyToken, {
            audience: ['host.exp.Exponent', 'com.skatekrak.Krak'],
        })
        .then(({ sub, email }) => {
            userEmail = email;
            userAppleId = sub;

            return User.findOne({
                'auth.apple.apple_id': sub,
            }).exec();
        })
        .then((user) => {
            if (user) {
                return Promise.reject(
                    new APIError(
                        ['You already have a account on Krak with this Facebook account'],
                        httpStatus.UNAUTHORIZED,
                    ),
                );
            }

            return User.exist(username);
        })
        .then((usernameTaken) => {
            if (usernameTaken) {
                return Promise.reject(new APIError(['This username is already taken'], httpStatus.UNAUTHORIZED));
            }

            newUser = new User({
                _id: username,
                email: userEmail,
                auth: {
                    apple: {
                        apple_id: userAppleId,
                    },
                },
            });

            return newUser.save();
        })
        .then((savedUser) => {
            const newProfile = new Profile();
            newProfile.username = savedUser.id;

            return newProfile.save();
        })
        .then(() => {
            return sendTokenResponse(req.headers, res, newUser, mobile, rememberMe, next);
        })
        .catch((e) => next(e));
}

/**
 * Log out with cookie
 */
function logout(req, res, next) {
    // Delete token
    const { token } = req;

    // Remove cookie from Browser
    res.clearCookie('bearer', COOKIE_CONFIG);

    Token.remove(token)
        .then(() => {
            res.json({
                message: 'Logged out',
            });
        })
        .catch((e) => next(e));
}

/**
 * Forgot password
 */
function forgotPassword(req, res, next) {
    User.byEmail(req.body.email)
        .then((userRes) => {
            const user = userRes;
            const token = crypto.randomBytes(20).toString('hex');

            user.resetPasswordToken = token;
            user.resetPasswordExpires = new Date().getTime() + 3600000; // 1 hours
            return user.save();
        })
        .then((savedUser) => {
            // send mail
            const link = `https://skatekrak.com/auth/reset?token=${savedUser.resetPasswordToken}`;

            const mailOptions = {
                from: '"Krak" <hey@skatekrak.com>',
                to: savedUser.email,
                subject: 'Krak password reset',
                html:
                    `You are receiving this because you (or someone else) have requested the reset of the password for you account <strong>${savedUser.id}</strong>.<br/><br/>` +
                    // eslint-disable-next-line
                    'Please click on the following link, or paste this into your browser to complete to process:<br/><br/>' +
                    `<a href="${link}">${link}</a><br/><br/>` +
                    'Be aware that the link is only active for <strong>1 hour</strong><br/><br/>' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.',
            };

            return mails.send(mailOptions);
        })
        .then(() => {
            res.json({
                message: `An email has been sent ${req.body.email} with further instructions`,
            });
        })
        .catch((err) => next(err));
}

/**
 * Reset the password
 */
function resetPassword(req, res, next) {
    const { resetToken, password } = req.body;
    User.byResetToken(resetToken)
        .then((userRes) => {
            const user = userRes;
            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            return user.save();
        })
        .then((savedUser) => {
            const mailOptions = {
                from: '"Krak" <no-reply@skatekrak.com>',
                to: savedUser.email,
                subject: 'Your password has been changed',
                text: `Hey!\n\nThis is a confirmation that the password for your account ${savedUser.email} has just been changed.`,
            };
            return mails.send(mailOptions);
        })
        .then(() => {
            res.json({
                message: 'Success! Your password has been changed',
            });
        })
        .catch((e) => next(e));
}

/**
 * Send to the logged user itself
 */
function me(req, res, next) {
    User.get(req.user.id)
        .then((user) => res.json(user))
        .catch((err) => next(err));
}

function session(req, res) {
    res.json(req.user);
}

export default {
    login,
    signup,
    loginFacebook,
    signupFacebook,
    loginApple,
    signupApple,
    logout,
    forgotPassword,
    resetPassword,
    me,
    session,
};
