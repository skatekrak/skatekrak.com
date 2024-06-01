import httpStatus from 'http-status';
import got from 'got';

import mongoose from '../server/mongo';
import logger from '../server/logger';
import APIError from '../helpers/api-error';
import utils from './utils';
import config from '../server/config';

import User from './user';
import NotificationInfo, { NotificationInfoSchema } from './notification-info';
import Push from './push';

export const NotificationSchema = new mongoose.Schema(
    {
        createdAt: {
            type: Date,
            index: true,
        },
        updatedAt: {
            type: Date,
            index: true,
        },
        className: {
            type: String,
            default: 'notification',
        },
        fromUser: {
            type: String,
            ref: 'Profile',
            required: true,
            index: true,
        },
        toUser: {
            type: String,
            ref: 'Profile',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['like', 'mention', 'comment', 'follow', 'with'],
            required: true,
            index: true,
        },
        infos: [NotificationInfoSchema],
    },
    utils.genSchemaConf(),
);

NotificationSchema.virtual('message').get(function() {
    const notif = this;
    let message = '';
    const fromUsername = notif.fromUser.id ? notif.fromUser.id : notif.fromUser;

    if (notif.type === 'with') {
        const { className } = notif.infos[0];
        message = `Big up for your ${className} with ${fromUsername}!`;
    } else {
        switch (notif.type) {
            case 'like':
                message = 'liked your';
                break;
            case 'comment':
                message = 'commented on your';
                break;
            case 'mention':
                message = 'mentioned you on a';
                break;
            case 'follow':
                message = 'follows you';
                break;
            default:
                message = '';
                break;
        }

        message = `${fromUsername} ${message}`;

        if (notif.infos) {
            if (notif.infos.length === 1) {
                const info = notif.infos[notif.infos.length - 1];
                message += ` ${info.className}`;
            } else if (notif.infos.length > 1) {
                const last = notif.infos[notif.infos.length - 1];
                const info = notif.infos[notif.infos.length - 2];
                message += ` ${info.className}`;

                if (last.className === 'comment') {
                    message += `: "${last.content}"`;
                }
            }
        }
    }

    return message;
});
/**
 * Methods
 */

/**
 * Generate a Idempotency Key from the notification
 */
NotificationSchema.methods.genIdempotencyKey = function() {
    const elements = [this.fromUser, 'to', this.toUser, this.type];

    if (this.infos && this.infos.length > 0) {
        elements.push(this.infos[0].id);
    }

    if (this.type === 'comment') {
        elements.push(this.infos[this.infos.length - 1].id);
    }

    const random = Math.floor(Math.random() * 11);
    elements.push(random);

    return Buffer.from(elements.join(':')).toString('base64');
};

/**
 *
 * @param {Notification} notification - Notification to be sent as push
 */
async function sentToGeranium(notification) {
    logger.debug('function sentToGeranium');

    if (config.NODE_ENV === 'development' || config.NODE_ENV === 'test') {
        return; // we don't go through this when testing or dev to allow offline work
    }

    const user = await User.get(notification.toUser);

    // Check if the current user have installations
    const iosInstallations = user.getInstallations('ios');
    logger.debug(iosInstallations);
    const androidTokens = user.getInstallations('android').map((install) => install.deviceToken);
    logger.debug(androidTokens);

    if (iosInstallations.length <= 0 && androidTokens.length <= 0) {
        logger.info("not sending notification because the receipient doesn't have any mobile tokens");
        return;
    }

    // Check if the Push was already done
    const idempotencyKey = notification.genIdempotencyKey();
    try {
        await Push.get(idempotencyKey);
        logger.info('not sending notification because this kind of notification for this media has been already sent');
        return;
    } catch (error) {
        // No need to catch the error
    }

    logger.debug('Will POST to geranium');

    // Increment badge number for each installations and don't send useless data
    const cleanediOSInstallations = iosInstallations.map((installation) => ({
        deviceToken: installation.deviceToken,
        badge: installation.badge + 1,
    }));

    const body = {
        message: notification.message,
        ios: {
            installations: cleanediOSInstallations,
        },
        android: {
            tokens: androidTokens,
        },
    };

    logger.debug('Body', body);

    got.post(`${config.GERANIUM_URL}/notifications/send`, {
        headers: {
            idempotency: idempotencyKey,
            Authorization: config.GERANIUM_TOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        json: true,
    })
        .then((response) => {
            logger.info('Response from Geranium: ', response.body);
            const push = new Push({
                _id: response.body.idempotency,
                tokens: user.installations.map((i) => i._id),
                message: response.body.message,
            });
            return push.save();
        })
        .then((savedPush) => {
            logger.info('Saved push: ', savedPush);
            return user.save();
        })
        .catch((e) => logger.error(e));
}

/**
 * Statics
 */
NotificationSchema.statics = {
    /**
     * Get notification
     * @param {ObjectId} id - this _id of notification
     * @returns  {Promise<Notification, Error>}
     */
    get(id) {
        return this.findById(id)
            .populate('toUser fromUser')
            .exec()
            .then((notification) => {
                if (notification) {
                    return notification;
                }

                const err = new APIError(['No such notification exists'], httpStatus.NOT_FOUND);
                return Promise.reject(err);
            })
            .catch((err) => Promise.reject(err));
    },

    /**
     * Retrieve notification by its object._id
     * @param {ObjectId} id - _id of object of the notification to retrieve
     * @returns  {Promise<Notification, Error>}
     */
    getByObject(id) {
        return this.findOne({ 'objects._id': id })
            .exec()
            .then((notification) => {
                if (notification) {
                    return notification;
                }

                const err = new APIError(['No such notification exists'], httpStatus.NOT_FOUND);
                return Promise.reject(err);
            })
            .catch((err) => Promise.reject(err));
    },

    /**
     * Create notification
     * @param {String} fromUserId - id of the notification's author
     * @param {String} toUserId - id of the targeted user
     * @param {String} type - Notification type [mention, like, follow, comment]
     * @param {Object} object - Object related to the notification
     * @returns {Notification}
     */
    push(fromUserId, toUserId, type, objects) {
        const notification = new this();
        notification.fromUser = fromUserId;
        notification.toUser = toUserId;
        notification.type = type;

        if (objects) {
            logger.debug('Objects sent', objects);
            const infos = [];
            objects.forEach((obj) => {
                const info = NotificationInfo({
                    id: obj.id,
                    className: obj.className,
                });

                if (obj.className === 'comment') {
                    info.content = obj.content;
                }

                if (obj.className === 'media' && obj.image.url) {
                    info.url = obj.image.url;
                } else if (obj.className === 'clip') {
                    info.url = obj.thumbnailURL;
                } else if (obj.className === 'spot') {
                    info.url = obj.coverURL;
                } else if (obj.className === 'session') {
                    info.url = obj.coverURL;
                }

                infos.push(info);
            });
            logger.debug('Infos out', infos);
            notification.infos = infos;
        }

        logger.debug('Notification about to be saved', notification.toJSON());

        /* In the case where we are not testing and that
        the logged user is doing something that create a notification */
        if (notification.fromUser === notification.toUser) {
            return Promise.resolve({});
        }
        sentToGeranium(notification);
        return notification.save();
    },

    /**
     * List notifications for a given user in descending order of 'createdAt'
     * @param {number} skip - Number of notifications to be skipped.
     * @param {number} limit - Limit number of notifications to be returned
     * @param {String} id - User id of toUser
     * @returns {Promise<Notification[]>}
     */
    list({ skip = 0, limit = 20, id = '' } = {}) {
        return this.find({ toUser: id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('toUser', 'profilePicture')
            .populate('fromUser', 'profilePicture')
            .exec();
    },
};

/**
 * @typedef Notification
 */
export default mongoose.model('Notification', NotificationSchema);
