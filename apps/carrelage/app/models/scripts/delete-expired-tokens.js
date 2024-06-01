import Token from '../token';
import logger from '../../server/logger';

export default async function apply(params) {
    const { safe } = params;
    if (safe) {
        logger.warn('Safe mode => No safe mode for this method');
    } else {
        const res = await Token.deleteMany({ expires: { $lt: new Date() } }).exec();
        logger.info(res);
    }
}
