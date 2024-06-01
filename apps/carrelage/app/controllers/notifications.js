import Notification from '../models/notification';

/**
 * Load notification and append to req
 */
function load(req, res, next) {
    Notification.get(req.params.objectId)
        .then((notification) => {
            req.object.push(notification);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get list of notifications
 * @property {number} req.query.skip - Number of notifications to be skipped
 * @property {number} req.query.limit - Limit of notifications to be returned
 * @returns {Notifications[]}
 */
function list(req, res, next) {
    const { limit = 20, skip = 0 } = req.query;
    const id = req.user._id;

    Notification.list({ limit, skip, id })
        .then((notifications) => res.json(notifications))
        .catch((e) => next(e));
}

export default { load, list };
