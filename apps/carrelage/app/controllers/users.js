import httpStatus from 'http-status';
import got from 'got';

import cloudinary from '../helpers/cloudinary';
import logger from '../server/logger';
import auth from '../server/auth';
import config from '../server/config';

import User from '../models/user';
import Profile from '../models/profile';
import Notification from '../models/notification';
import Media from '../models/media';
import Clip from '../models/clip';
import Spot from '../models/spot';
import Token from '../models/token';
import Feedback from '../models/feedback';
import LearnVideo from '../models/learn-video';
import Session from '../models/session';
import TrickDone from '../models/trick-done';
import APIError from '../helpers/api-error';

/**
 * Load user and append to req
 */
function load(req, res, next) {
    User.get(req.params.userId)
        .then((user) => {
            req.object.push(user);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get user
 * @return {User}
 */
function get(req, res) {
    const user = req.object.last().el();
    if (!auth.isAdmin(req)) {
        delete user.auth;
    }
    return res.json(user);
}

function me(req, res, next) {
    User.get(req.user.id)
        .then((user) => {
            if (!auth.isAdmin(req)) {
                delete user.auth;
            }
            res.json(user);
        })
        .catch(next);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.role - The role of user.
 */
function create(req, res, next) {
    User.creator(req.body.username, req.body.password, req.body.email, req.body.role)
        .then((user) => {
            if (!auth.isAdmin(user)) {
                delete user.auth;
            }
            res.json(user);
        })
        .catch((e) => next(e));
}

/**
 * Update existing user
 * @returns {User}
 */
function update(req, res, next) {
    const user = req.object.last().el();

    if (req.body.email) {
        user.email = req.body.email;
    }

    if (req.body.password) {
        user.password = req.body.password;
    }

    if (req.body.welcomeEmailSent) {
        user.welcomeEmailSent = req.body.welcomeEmailSent;
    }

    if (req.body.emailVerified) {
        user.emailVerified = req.body.emailVerified;
    }

    // Update that can be done only by an admin
    if (auth.isAdmin(req) && req.body.role) {
        user.role = req.body.role;
        Token.removeAllFrom(user.id);
    }

    user.save()
        .then((savedUser) => {
            if (!auth.isAdmin(savedUser)) {
                delete savedUser.auth;
            }
            res.json(savedUser);
        })
        .catch((e) => next(e));
}

/**
 * The user can ask a new confirmation email
 * to validate his/her email
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function sendConfirmationEmail(req, res, next) {
    const user = req.object.last().el();

    try {
        await user.sendConfirmationEmail();
        user.welcomeEmailSent = true;
        await user.save();
        res.json({ message: 'Confirmation email sent' });
    } catch (error) {
        next(error);
    }
}

/**
 * Confirm the user's email with the given token
 * @param {string} req.body.token
 */
async function confirmEmail(req, res, next) {
    const user = req.object.last().el();
    const { token } = req.body;

    try {
        if (user.emailConfirmationToken !== token) {
            throw new APIError(['Invalid token'], httpStatus.BAD_REQUEST);
        }

        user.emailConfirmationToken = undefined;
        user.emailVerified = true;
        const savedUser = await user.save();

        if (!auth.isAdmin(req)) {
            delete savedUser.auth;
        }

        res.json(savedUser);
    } catch (error) {
        next(error);
    }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped
 * @property {number} req.query.limit - Limit of users to be returned
 * @returns {Users[]}
 */
function list(req, res, next) {
    const { limit = 20, skip = 0, email } = req.query;
    User.list({ limit, skip, email })
        .then((users) => {
            if (!auth.isAdmin(req)) {
                users = users.map((user) => {
                    delete user.auth;
                    return user;
                });
            }
            res.json(users);
        })
        .catch((e) => next(e));
}

function renameObjs(objs, oldUsername, username) {
    logger.debug('renameObjs');
    return objs.map((objRes) => {
        const obj = objRes;
        if (obj.addedBy === oldUsername) {
            obj.addedBy = username;
        }
        return obj.save();
    });
}

function renameLikes(objs, oldUsername, username) {
    logger.debug('renameLikes');
    return objs.map((obj) => {
        obj.likes.forEach((likeRes) => {
            const like = likeRes;
            if (like.addedBy === oldUsername) {
                like.addedBy = username;
            }
        });
        return obj.save();
    });
}

function renameComments(objs, oldUsername, username) {
    logger.debug('renameComments');
    return objs.map((obj) => {
        obj.comments.forEach((commentRes) => {
            const comment = commentRes;
            if (comment.addedBy === oldUsername) {
                comment.addedBy = username;
            }
        });
        return obj.save();
    });
}

function renameSpotEdits(objs, oldUsername, username) {
    logger.debug('renameSpotEdits');
    return objs.map((obj) => {
        obj.edits.forEach((editRes) => {
            const edit = editRes;
            if (edit.addedBy === oldUsername) {
                edit.addedBy = username;
            }
        });
        return obj.save();
    });
}

function renameCommentsLikes(objs, oldUsername, username) {
    logger.debug('renameCommentsLikes');
    return objs.map((obj) => {
        obj.comments.forEach((comment) => {
            comment.likes.forEach((likeRes) => {
                const like = likeRes;
                if (like.addedBy === oldUsername) {
                    like.addedBy = username;
                }
            });
        });
        return obj.save();
    });
}

function renameUsertags(objs, oldUsername, username) {
    logger.debug('renameUsertags');
    return objs.map((obj) => {
        const i = obj.usertags.indexOf(oldUsername);
        if (i > -1) {
            obj.usertags.set(i, username);
        }
        return obj.save();
    });
}

function renameUsertagsComments(objs, oldUsername, username) {
    logger.debug('renameUsertagsComments');
    return objs.map((obj) => {
        obj.comments.forEach((comment) => {
            const i = comment.usertags.indexOf(oldUsername);
            if (i > -1) {
                comment.usertags.set(i, username);
            }
        });
        return obj.save();
    });
}

/**
 * Rename user
 * @property {string} username - New username
 * @return {User}
 */
async function rename(req, res, next) {
    if (req.user.username === req.body.username) {
        res.json(req.object.last().el());
        return;
    }

    const exist = await User.exist(req.body.username);
    if (exist) {
        next(new APIError(['This username is already used'], httpStatus.NOT_ACCEPTABLE));
    }

    const user = req.object.last().el();

    const oldUsername = user.username;
    const { username } = req.body;

    Media.find({ addedBy: oldUsername })
        .exec()
        /* ------ MEDIA ------*/
        .then((medias) => Promise.all(renameObjs(medias, oldUsername, username)))

        // Rename all likes posted by the user
        .then(() => Media.find({ 'likes.addedBy': oldUsername }).exec())
        .then((medias) => Promise.all(renameLikes(medias, oldUsername, username)))

        // Rename addedBy on comments posted
        .then(() => Media.find({ 'comments.addedBy': oldUsername }).exec())
        .then((medias) => Promise.all(renameComments(medias, oldUsername, username)))

        .then(() => Media.find({ 'comments.usertags': oldUsername }).exec())
        .then((medias) => Promise.all(renameUsertagsComments(medias, oldUsername, username)))

        // Rename addedBy on comments's likes
        .then(() => Media.find({ 'comments.likes.addedBy': oldUsername }).exec())
        .then((medias) => Promise.all(renameCommentsLikes(medias, oldUsername, username)))

        // Rename in usertags
        .then(() => Media.find({ usertags: oldUsername }).exec())
        .then((medias) => Promise.all(renameUsertags(medias, oldUsername, username)))

        /* ------ CLIP ------*/

        // Rename addedBy on Clip
        .then(() => Clip.find({ addedBy: oldUsername }).exec())
        .then((clips) => Promise.all(renameObjs(clips, oldUsername, username)))

        // Rename addedBy on clip's like
        .then(() => Clip.find({ 'likes.addedBy': oldUsername }).exec())
        .then((clips) => Promise.all(renameLikes(clips, oldUsername, username)))

        // Rename addedBy on clip's comment
        .then(() => Clip.find({ 'comments.addedBy': oldUsername }).exec())
        .then((clips) => Promise.all(renameComments(clips, oldUsername, username)))

        // Rename in comment's usertags
        .then(() => Clip.find({ 'comments.usertags': oldUsername }).exec())
        .then((clips) => Promise.all(renameUsertagsComments(clips, oldUsername, username)))

        // Rename addedBy on clip's comment's like
        .then(() => Clip.find({ 'comments.likes.addedBy': oldUsername }).exec())
        .then((clips) => Promise.all(renameCommentsLikes(clips, oldUsername, username)))

        /* ------ LEARN-VIDEO ------*/
        // Rename addedBy on LearnVideo's like
        .then(() => LearnVideo.find({ 'likes.addedBy': oldUsername }).exec())
        .then((learnVideos) => Promise.all(renameLikes(learnVideos, oldUsername, username)))

        // Rename addedBy on LearnVideo's comment
        .then(() => LearnVideo.find({ 'comments.addedBy': oldUsername }).exec())
        .then((learnVideos) => Promise.all(renameComments(learnVideos, oldUsername, username)))

        // Rename in comment's usertags
        .then(() => LearnVideo.find({ 'comments.usertags': oldUsername }).exec())
        .then((learnVideos) => Promise.all(renameUsertagsComments(learnVideos, oldUsername, username)))

        // Rename addedBy on LearnVideo's comment's like
        .then(() => LearnVideo.find({ 'comments.likes.addedBy': oldUsername }).exec())
        .then((learnVideos) => Promise.all(renameCommentsLikes(learnVideos, oldUsername, username)))

        /* ------ SESSION ------*/
        // Rename addedBy on SESSION
        .then(() => Session.find({ addedBy: oldUsername }).exec())
        .then((sessions) => Promise.all(renameObjs(sessions, oldUsername, username)))

        .then(() => Session.find({ usertags: oldUsername }).exec())
        .then((sessions) => Promise.all(renameUsertags(sessions, oldUsername, username)))

        // Rename addedBy on Session's like
        .then(() => Session.find({ 'likes.addedBy': oldUsername }).exec())
        .then((sessions) => Promise.all(renameLikes(sessions, oldUsername, username)))

        // Rename addedBy on Session's comment
        .then(() => Session.find({ 'comments.addedBy': oldUsername }).exec())
        .then((sessions) => Promise.all(renameComments(sessions, oldUsername, username)))

        // Rename in comment's usertags
        .then(() => Session.find({ 'comments.usertags': oldUsername }).exec())
        .then((sessions) => Promise.all(renameUsertagsComments(sessions, oldUsername, username)))

        .then(() => Session.find({ 'comments.likes.addedBy': oldUsername }).exec())
        .then((sessions) => Promise.all(renameCommentsLikes(sessions, oldUsername, username)))

        .then(() => Session.find({ with: oldUsername }).exec())
        .then((sessions) =>
            Promise.all(
                sessions.map((session) => {
                    const i = session.with.indexOf(oldUsername);
                    session.with.set(i, username);
                    return session.save();
                }),
            ),
        )

        /* ------ SPOTS ------*/
        // Rename addedBy of Spot
        .then(() => Spot.find({ addedBy: oldUsername }).exec())
        .then((spots) => Promise.all(renameObjs(spots, oldUsername, username)))

        // Rename addedBy of Spot's comment
        .then(() => Spot.find({ 'comments.addedBy': oldUsername }).exec())
        .then((spots) => Promise.all(renameComments(spots, oldUsername, username)))

        // Rename in comment's usertags
        .then(() => Spot.find({ 'comments.usertags': oldUsername }).exec())
        .then((spots) => Promise.all(renameUsertags(spots, oldUsername, username)))

        // Rename addedBy of Spot's comment's like
        .then(() => Spot.find({ 'comments.likes.addedBy': oldUsername }).exec())
        .then((spots) => Promise.all(renameCommentsLikes(spots, oldUsername, username)))

        // Rename addedBy of Spot edits
        .then(() => Spot.find({ 'edits.addedBy': oldUsername }).exec())
        .then((spots) => Promise.all(renameSpotEdits(spots, oldUsername, username)))

        /* ------ TRICK DONE ------*/
        // Renama addedBy of Trick Done
        .then(() => TrickDone.find({ addedBy: oldUsername }).exec())
        .then((tricksDone) => Promise.all(renameObjs(tricksDone, oldUsername, username)))

        // Rename all likes posted by the user
        .then(() => TrickDone.find({ 'likes.addedBy': oldUsername }).exec())
        .then((tricksDone) => Promise.all(renameLikes(tricksDone, oldUsername, username)))

        // Rename addedBy on comments posted
        .then(() => TrickDone.find({ 'comments.addedBy': oldUsername }).exec())
        .then((tricksDone) => Promise.all(renameComments(tricksDone, oldUsername, username)))

        .then(() => TrickDone.find({ 'comments.usertags': oldUsername }).exec())
        .then((tricksDone) => Promise.all(renameUsertagsComments(tricksDone, oldUsername, username)))

        // Rename addedBy on comments's likes
        .then(() => TrickDone.find({ 'comments.likes.addedBy': oldUsername }).exec())
        .then((tricksDone) => Promise.all(renameCommentsLikes(tricksDone, oldUsername, username)))

        // Feedbacks
        .then(() => Feedback.find({ addedBy: oldUsername }).exec())
        .then((feedbacks) => Promise.all(renameObjs(feedbacks, oldUsername, username)))

        // followers
        .then(() => Profile.find({ followers: oldUsername }).exec())
        .then((profiles) => {
            logger.debug('Followers');
            return Promise.all(
                profiles.map((profile) => {
                    const i = profile.followers.indexOf(oldUsername);
                    profile.followers.set(i, username);
                    return profile.save();
                }),
            );
        })

        // following
        .then(() => Profile.find({ following: oldUsername }).exec())
        .then((profiles) => {
            logger.debug('Following');
            return Promise.all(
                profiles.map((profile) => {
                    const i = profile.following.indexOf(oldUsername);
                    profile.following.set(i, username);
                    return profile.save();
                }),
            );
        })

        // Notification toUser
        .then(() => Notification.find({ toUser: oldUsername }).exec())
        .then((notifs) => {
            logger.debug('Notification toUser');
            return Promise.all(
                notifs.map((notifRes) => {
                    const notif = notifRes;
                    notif.toUser = username;
                    if (notif.info && notif.info.content) {
                        notif.info.content = notif.info.content.replaceAll(`@${oldUsername}`, `@${username}`);
                    }
                    return notif.save();
                }),
            );
        })

        // Notification fromUser
        .then(() => Notification.find({ fromUser: oldUsername }).exec())
        .then((notifs) => {
            logger.debug('Notification fromUser', notifs.length);
            return Promise.all(
                notifs.map((notifRes) => {
                    const notif = notifRes;
                    notif.fromUser = username;
                    return notif.save();
                }),
            );
        })

        .then(() => Profile.get(oldUsername))
        .then((profile) => Profile.remove({ _id: oldUsername }).then(() => profile))
        .then((profileRes) => {
            const profile = profileRes;
            profile.username = username;
            profile.isNew = true;
            logger.debug('New profile', profile);
            return profile.save();
        })
        .then(() => Token.rename(oldUsername, username))
        .then((rawResponse) => {
            logger.debug('Rename tokens:', rawResponse);
            return User.remove({ _id: oldUsername }).exec();
        })
        .then(() => {
            user._id = username;
            user.isNew = true;
            return user.save();
        })
        .then((savedUser) => {
            res.json({
                message: 'authenticated',
                token: `Bearer ${req.token}`,
                user: savedUser,
            });
        })
        .catch((e) => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
    const user = req.object.last().el();

    user.remove()
        .then(() => {
            logger.debug('User removed');
            return Profile.findByIdAndRemove(user.id).exec();
        })
        .then((removedProfile) => {
            logger.debug('Profile removed');
            return Promise.all([
                cloudinary.destroy(removedProfile.profilePicture),
                cloudinary.destroy(removedProfile.banner),
            ]);
        })
        .then((cloudinaryResponse) => {
            logger.debug('Media removed', cloudinaryResponse);
            return Promise.all([
                Notification.find({
                    toUser: user.id,
                }).exec(),
                Notification.find({
                    fromUser: user.id,
                }).exec(),
            ]);
        })
        .then((results) => {
            const elements = [...results[0], ...results[1]];
            return Promise.all(elements.map((el) => el.remove()));
        })
        .then((deletedNotifications) => {
            logger.debug('Notifications removed', deletedNotifications);
            return Promise.all([
                Profile.find({
                    followers: user.id,
                }).exec(),
                Profile.find({
                    following: user.id,
                }).exec(),
            ]);
        })
        .then((results) => {
            const profiles = [...results[0], ...results[1]];

            profiles.forEach((profile) => {
                profile.following.pull(user.id);
                profile.followers.pull(user.id);
            });

            return Promise.all(profiles.map((profile) => profile.save()));
        })
        .then((results) => {
            logger.debug('Profile saved', results);
            return Token.removeAllFrom(user.id);
        })
        .then((results) => {
            logger.debug('Tokens removed', results.result);
            res.json(user);
        })
        .catch((e) => next(e));
}

export default {
    load,
    me,
    get,
    create,
    update,
    list,
    rename,
    remove,
    sendConfirmationEmail,
    confirmEmail,
};
