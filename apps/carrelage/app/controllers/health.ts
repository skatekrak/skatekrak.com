import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import APIError from '../helpers/api-error';
import config from '../server/config';
import { isAlive as isMongoAlive } from '../server/mongo';

async function healthCheck(req: Request, res: Response, next: NextFunction) {
    try {
        await isMongoAlive();
        res.json({
            message: req.__('Krak Carrelage API'),
            disclaimer: 'https://www.youtube.com/watch?v=uHNZDhtaAKQ',
            version: config.VERSION,
            status: req.__('Healthy'),
        });
    } catch (err) {
        next(new APIError(['API is not ready'], httpStatus.SERVICE_UNAVAILABLE, err));
    }
}

export default { healthCheck };
