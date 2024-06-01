import Push from '../models/push';

/**
 * Load notification and append to req
 */
function load(req, res, next) {
    Push.get(req.params.objectId)
        .then((push) => {
            req.object.push(push);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get push
 */
function get(req, res) {
    res.json(req.object.last().el());
}

/**
 * Get list of pushes
 * @property {number} req.query.skip - Number of pushes to be skipped
 * @property {number} req.query.limit - Limit of pushes to be returned
 * @returns {PushNotifications[]}
 */
function list(req, res, next) {
    const { limit = 20, skip = 0 } = req.query;

    Push.list({ limit, skip })
        .then((pushes) => res.json(pushes))
        .catch((e) => next(e));
}

export default { load, get, list };
