import httpStatus from 'http-status';
import Comment from '../models/comment';
import APIError from '../helpers/api-error';
import Notification from '../models/notification';
import logger from '../server/logger';
import rewardCtrl from './rewards';

/**
 * Load comment and append to req
 */
function load(req, res, next) {
    const comment = Comment.get(req.object.last().el(), req.params.objectId);

    if (comment) {
        req.object.push(comment);
        next();
    } else {
        next(new APIError(['No such comment'], httpStatus.NOT_FOUND));
    }
}

/**
 * Get comment
 * @returns {Comment}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Create new comments
 * @property {string} req.body.content - Content of the comment
 * @returns {Comment}
 */
function create(req, res, next) {
    const comment = new Comment({
        _content: req.body.content,
        addedBy: req.user._id,
    });
    comment.extractTags();

    const parent = req.object.last().el();
    parent.comments.push(comment);
    req.object.push(comment);

    // Create the notifications for the mentions
    comment.usertags.forEach((user) => {
        Notification.push(req.user.id, user, 'mention', req.object.elementsList())
            .then((savedNotification) => {
                logger.info('saved notification', savedNotification);
            })
            .catch((e) => next(e));
    });

    // Create the notification for the comment
    if (parent.className === 'media' || parent.className === 'clip' || parent.className === 'session') {
        req.object
            .first()
            .el()
            .save()
            .then(() => {
                res.json(comment);
                rewardCtrl.checkComment(req.user._id);
                return Notification.push(req.user.id, parent.addedBy.id, 'comment', req.object.elementsList());
            })
            .catch((e) => next(e));
    } else {
        req.object
            .first()
            .el()
            .save()
            .then(() => res.json(comment))
            .catch((e) => next(e));
    }
}

/**
 * Update existings comment
 * @returns {Comment}
 */
function update(req, res, next) {
    const comment = req.object.last().el();
    const parent = req.object
        .last()
        .parent()
        .el();

    if (req.body.content) {
        parent.comments.id(comment._id)._content = req.body.content;
        parent.comments.id(comment._id).extractTags();
        /* Retrieving the notification for this comment,
        so we can update the comment within */
        Notification.getByObject(comment._id)
            .then((notificationRes) => {
                const notification = notificationRes;
                notification.object = req.object.childLinkedList();
                return notification.save();
            })
            .then(() =>
                req.object
                    .first()
                    .el()
                    .save(),
            )
            .then(() => res.json(comment))
            .catch((e) => next(e));
    } else {
        res.json(comment);
    }
}

/**
 * Remove existings comment
 * @returns {Comment}
 */
function remove(req, res, next) {
    const comment = req.object.last().el();
    const parent = req.object
        .last()
        .parent()
        .el();
    parent.comments.id(comment._id).remove();
    parent
        .save()
        .then((savedParent) => res.json(savedParent))
        .catch((e) => next(e));
}

export default {
    load,
    get,
    create,
    update,
    remove,
};
