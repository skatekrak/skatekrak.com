import httpStatus from 'http-status';

import Media from '../media';
import APIError from '../../helpers/api-error';
import logger from '../../server/logger';

export default async function apply(params) {
    const hourInMillis = 3600000;
    const minusOneDay = new Date() - hourInMillis;

    const { safe, older = minusOneDay } = params;
    if (older >= new Date()) {
        throw new APIError(['Older date should be before now'], httpStatus.BAD_REQUEST);
    }

    const counted = await Media.count({ createdAt: { $lt: older }, image: null });
    logger.info(`${counted} medias matched `);

    if (!safe) {
        const deleted = await Media.deleteMany({ createdAt: { $lt: older }, image: null });
        logger.info('medias deleted', deleted);
    }
}
