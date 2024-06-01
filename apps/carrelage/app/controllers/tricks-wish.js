import httpStatus from 'http-status';

import APIError from '../helpers/api-error';
import logger from '../server/logger';
import Trick from '../models/trick';
import TrickWish from '../models/trick-wish';

function load(req, res, next) {
    const profile = req.object.last().el();
    const trickWish = profile.tricksWishlist.id(req.params.trickWishId);

    if (trickWish) {
        req.object.push(trickWish);
        next();
    } else {
        next(new APIError(['No such trick in wishlist'], httpStatus.NOT_FOUND));
    }
}

async function create(req, res, next) {
    const profile = req.object.last().el();

    const { trick: trickId, stance, terrain, amountWanted } = req.body;

    try {
        // First let's check if the trick exist
        const trick = await Trick.get(trickId);

        const trickWish = new TrickWish({
            trick: trickId,
            stance,
            terrain,
            amountWanted,
        });
        trickWish.setId();

        // Before pushing, we check if the trickWish already exist
        const existing = profile.tricksWishlist.id(trickWish.id);
        if (existing) {
            throw new APIError(['This precise trick already exist in your wishlist'], httpStatus.NOT_ACCEPTABLE);
        }

        profile.tricksWishlist.push(trickWish);

        const savedProfile = await profile.save();
        const savedTrickWish = savedProfile.tricksWishlist[savedProfile.tricksWishlist.length - 1];
        savedTrickWish.trick = trick;
        res.json(savedTrickWish);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    const trickWish = req.object.last().el();
    const profile = req.object
        .last()
        .parent()
        .el();

    const { amountWanted } = req.body;
    profile.tricksWishlist.id(trickWish.id).amountWanted = amountWanted;

    try {
        const savedProfile = await profile.save();
        const savedTrickWish = savedProfile.tricksWishlist.id(trickWish.id);
        res.json(savedTrickWish);
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    const trickWish = req.object.last().el();
    const profile = req.object
        .last()
        .parent()
        .el();

    profile.tricksWishlist.id(trickWish.id).remove();

    try {
        const savedProfile = await profile.save();
        const savedTrickWish = savedProfile.tricksWishlist[savedProfile.tricksWishlist.length - 1];
        res.json(savedTrickWish);
    } catch (error) {
        next(error);
    }
}

async function reset(req, res, next) {
    const profile = req.object.last().el();

    try {
        profile.tricksWishlist = [];
        logger.debug('Profile', profile.toJSON());
        await profile.save();
        res.json({ message: 'ok' });
    } catch (error) {
        next(error);
    }
}

export default {
    load,
    create,
    update,
    remove,
    reset,
};
