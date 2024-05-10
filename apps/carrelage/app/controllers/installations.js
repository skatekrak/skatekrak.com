import httpStatus from 'http-status';

import Installation from '../models/installation';
import APIError from '../helpers/api-error';

/**
 * Load installation an append to req
 */
function load(req, res, next) {
    const installation = Installation.get(req.object.last().el(), req.params.objectId);

    if (installation) {
        req.object.push(installation);
        next();
    } else {
        next(new APIError(['No such installation'], httpStatus.NOT_FOUND));
    }
}

/**
 * Get Installation
 * @return {Installation}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Create new installation
 * @property {String} req.body.deviceToken - Token of the mobile
 * @property {String} req.body.locale - locale
 * @property {String} req.body.deviceType - ios or android
 * @property {String} req.body.version - Used version of the app
 * @property {String} req.body.timezone - Timezone of the mobile
 * @property {String[]} req.body.channels - Channel subscribed by the user
 * @return {Installation}
 */
function create(req, res, next) {
    const installation = new Installation({
        deviceToken: req.body.deviceToken,
        localeIdentifier: req.body.locale,
        deviceType: req.body.deviceType,
        version: req.body.version,
        timezone: req.body.timezone,
        channels: req.body.channels,
    });

    const parent = req.object.last().el();

    const install = parent.installations.filter((obj) => obj.deviceToken === installation.deviceToken)[0];
    if (!install) {
        parent.installations.push(installation);
        req.object.push(installation);

        return parent
            .save()
            .then(() => res.json(parent.installations[parent.installations.length - 1]))
            .catch((e) => next(e));
    }
    return res.json(install);
}

/**
 * Update existings installation
 * @property {String} req.body.locale - locale
 * @property {String} req.body.version - Used version of the app
 * @property {String} req.body.timezone - Timezone of the mobile
 * @property {String[]} req.body.channels - Channel subscribed by the user
 * @return {Installation}
 */
function update(req, res, next) {
    const installation = req.object.last().el();
    const parent = req.object
        .last()
        .parent()
        .el();

    if (req.body.locale) {
        installation.localeIdentifier = req.body.locale;
    }

    if (req.body.version) {
        installation.version = req.body.version;
    }

    if (req.body.timezone) {
        installation.timezone = req.body.timezone;
    }

    if (req.body.channels) {
        installation.channels = req.body.channels;
    }

    if (req.body.badge) {
        installation.badge = req.body.badge;
    }

    return parent
        .save()
        .then(() => res.json(parent.installations.id(installation._id)))
        .catch((e) => next(e));
}

/**
 * Remove existings instalation
 * @return {Installation}
 */
function remove(req, res, next) {
    const installation = req.object.last().el();
    const parent = req.object
        .last()
        .parent()
        .el();
    parent.installations.id(installation._id).remove();

    return parent
        .save()
        .then(() => res.json(installation))
        .catch((e) => next(e));
}

export default {
    load,
    get,
    create,
    update,
    remove,
};
