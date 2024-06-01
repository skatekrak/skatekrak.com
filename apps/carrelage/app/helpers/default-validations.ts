import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import httpStatus from 'http-status';
import Joi from 'joi';

import APIError from './api-error';

export function throwIfValidationFailed() {
    return (req: Request, _: Response, next: NextFunction) => {
        const errors = validationResult<{ msg: string }>(req);
        if (!errors.isEmpty()) {
            const array = errors.array();
            const unifiedErrorMessage = `${array.map((err) => req.__(err.msg)).join('.\n')}.`;
            return next(new APIError(unifiedErrorMessage, httpStatus.BAD_REQUEST));
        }
        return next();
    };
}

export default {
    objectId: {
        params: Joi.object({
            objectId: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        }),
    },
    userId: {
        params: Joi.object({
            userId: Joi.string().required(),
        }),
    },
    feed: {
        query: Joi.object()
            .keys({
                limit: Joi.number().positive(),
                newer: Joi.date().iso(),
                older: Joi.date().iso(),
            })
            .xor('newer', 'older'),
    },
};
