import httpStatus from 'http-status';

import APIError from '../helpers/api-error';
import auth from '../server/auth';
import Token from '../models/token';

function list(req, res, next) {
    Token.list(req.user.id)
        .then((tokens) => res.json(tokens))
        .catch((e) => next(e));
}

function load(req, res, next) {
    Token.getById(req.params.objectId)
        .then((token) => {
            req.object.push(token);
            return next();
        })
        .catch((e) => next(e));
}

function revoke(req, res, next) {
    const token = req.object.last().el();
    if (auth.isAdmin(req) || req.user.id === token.user) {
        token
            .remove()
            .then((deletedToken) => res.json(deletedToken))
            .catch((e) => next(e));
    } else {
        next(new APIError(['You do not have right permission'], httpStatus.FORBIDDEN));
    }
}

export default { list, load, revoke };
