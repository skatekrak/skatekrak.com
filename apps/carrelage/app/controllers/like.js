import httpStatus from 'http-status';

import Like from '../models/like';
import Notification from '../models/notification';
import APIError from '../helpers/api-error';
import logger from '../server/logger';
import rewardCtrl from './rewards';

/**
 * Load comment and append to req
 */
function load(req, res, next) {
    const like = Like.get(req.object.last().el(), req.params.objectId);

    if (like) {
        req.object.push(like);
        next();
    } else {
        next(new APIError(['No such like'], httpStatus.NOT_FOUND));
    }
}

/**
 * Get like
 * @returns {Like}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Create new likes
 * @returns {Like}
 */
function create(req, res, next) {
    const parent = req.object.last().el();

    const existingLike = parent.likes.find((l) => l.addedBy.id === req.user.id);

    if (existingLike) {
        res.json(existingLike);
        return;
    }

    const like = new Like({
        addedBy: req.user._id,
    });

    parent.likes.push(like);
    req.object.push(like);

    if (parent.addedBy) {
        req.object
            .first()
            .el()
            .save()
            .then(() => {
                res.json(like);
                rewardCtrl.checkLike(req.user._id, parent.addedBy.id ? parent.addedBy.id : parent.addedBy);
                return Notification.push(req.user.id, parent.addedBy.id, 'like', req.object.elementsList());
            })
            .then((savedNotification) => {
                logger.info('saved notification', savedNotification);
                return req.object
                    .first()
                    .el()
                    .save();
            })
            .catch((e) => next(e));
    } else {
        req.object
            .last() // like
            .parent() // parent (learnVideo, media, clip...)
            .el()
            .save()
            .then(() => res.json(like))
            .catch((e) => next(e));
    }
}

/**
 * Remove existings comment
 * @returns {Like}
 */
function remove(req, res, next) {
    const like = req.object.last().el();
    const parent = req.object
        .last()
        .parent()
        .el();
    parent.likes.id(like._id).remove();

    Notification.findOneAndRemove({
        'infos.id': like.id,
        'infos.className': 'like',
        type: 'like',
    })
        .exec()
        .then((deletedNotification) => {
            logger.info('delete notification', deletedNotification);
            return req.object
                .first()
                .el()
                .save();
        })
        .then(() => res.json(like))
        .catch((e) => next(e));
}

export default {
    load,
    get,
    create,
    remove,
};
