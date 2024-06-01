import httpStatus from 'http-status';
import SpotEdit from '../models/spot-edit';
import Spot from '../models/spot';
import APIError from '../helpers/api-error';

/**
 * Load spot edit and append to req
 */
function load(req, res, next) {
    const spotEdit = SpotEdit.get(req.object.last().el(), req.params.objectId);
    if (spotEdit) {
        req.object.push(spotEdit);
        next();
    } else {
        next(new APIError(['No such spot edit'], httpStatus.NOT_FOUND));
    }
}

/**
 * Get spot edit
 * @returns {SpotEdit}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Get all spot edits
 * @returns {SpotEdit[]}
 */
function all(req, res) {
    return res.json(req.object.last().el().edits);
}

/**
 * Create new spot edit
 * @returns {SpotEdit}
 */
async function create(req, res, next) {
    const spot = req.object.first().el();

    for (const edit of spot.edits) {
        if (edit.addedBy === req.user._id) {
            return next(
                new APIError(
                    ['You can only made 1 edit proposal per spot, delete the other before creating another'],
                    httpStatus.BAD_REQUEST,
                ),
            );
        }
    }

    const spotEdit = new SpotEdit({
        addedBy: req.user._id,
    });

    const {
        name,
        longitude,
        latitude,
        type,
        status,
        description,
        indoor,
        phone,
        website,
        instagram,
        snapchat,
        facebook,
        mergeInto,
    } = req.body;

    if (name) {
        spotEdit.name = name;
    }
    if (longitude && latitude) {
        spotEdit.longitude = longitude;
        spotEdit.latitude = latitude;
    }
    if (type) {
        spotEdit.type = type;
    }
    if (status) {
        spotEdit.status = status;
    }
    if (description) {
        spotEdit.description = description;
    }
    if (indoor) {
        spotEdit.indoor = indoor;
    }
    if (phone) {
        spotEdit.phone = phone;
    }
    if (website) {
        spotEdit.website = website;
    }
    if (instagram) {
        spotEdit.instagram = instagram;
    }
    if (snapchat) {
        spotEdit.snapchat = snapchat;
    }
    if (facebook) {
        spotEdit.facebook = facebook;
    }

    if (mergeInto) {
        if (spot.id === mergeInto) {
            return next(new APIError(["You can't merge a spot with itself"], httpStatus.BAD_REQUEST));
        }
        try {
            await Spot.get(mergeInto);
            spotEdit.mergeInto = mergeInto;
        } catch (err) {
            return next(new APIError(['The spot where you want to merge does not exist'], httpStatus.BAD_REQUEST));
        }
    }

    spot.edits.push(spotEdit);
    req.object.push(spotEdit);

    try {
        await req.object
            .first()
            .el()
            .save();
        return res.json(spotEdit);
    } catch (err) {
        return next(err);
    }
}

/**
 * Remove existing spot edit
 * @returns {SpotEdit}
 */
async function remove(req, res, next) {
    const spotEdit = req.object.last().el();
    const parent = req.object
        .last()
        .parent()
        .el();
    try {
        const removed = parent.edits.id(spotEdit._id);
        SpotEdit.deleteOne({ _id: spotEdit._id });
        await parent.save();
        res.json(removed);
    } catch (err) {
        next(err);
    }
}

export default {
    load,
    get,
    all,
    create,
    remove,
};
