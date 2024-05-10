import { waitIsAlive as waitMongoAlive } from './server/mongo';
import config from './server/config';
import app from './server/express';
import logger from './server/logger';

import User from './models/user';
import Token from './models/token';

async function createRoot() {
    const err = new Error('Error when create root user');
    const root = await User.ensureRootCreation(config.ROOT_EMAIL, config.ROOT_PASSWD).catch(() => err);
    await Token.ensureRootCreation(config.ROOT_TOKEN, root).catch(() => new Error('Error when create root token'));
}

function startExpress() {
    if (!module.parent) {
        app.listen(config.API_PORT, '0.0.0.0', () => {
            logger.info(`Express start on ${config.API_URL}:${config.API_PORT}`);
        });
    }
}

export const ready = waitMongoAlive()
    .then(() => {
        logger.info('MongoDB is alive');
        return createRoot();
    })
    .then(() => {
        logger.info('Root User & Token created');
        startExpress();
    })
    .catch((err) => {
        logger.error(err);
        process.exit(1);
    });

export default app;
