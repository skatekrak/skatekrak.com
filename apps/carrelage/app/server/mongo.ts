import mongo from 'mongoose';

import sleep from '../helpers/sleep';
import config from './config';
import logger from './logger';

mongo.Promise = Promise;
mongo.set('autoIndex', true);
mongo.connect(config.MONGO_URL);

const mongoError = new Error(`Unable to connect mongodb : ${config.MONGO_URL}`);

/**
 * Check if mongodb is alive
 */
export function isAlive() {
    return mongo.connection.db.command({ ping: 1 });
}

/**
 * Wait timeout seconds for mongo to be alive
 * @param {number} timeout - in seconds
 * @returns {Promise}
 */
export async function waitIsAlive(timeout = 30) {
    for (let i = 0; i < timeout; i += 1) {
        try {
            return await isAlive();
        } catch (err) {
            logger.info(`MongoDB is not alive yet => ${i + 1}/${timeout} pings`);
            await sleep(1000);
        }
    }
    throw mongoError;
}

export default mongo;
