import logger from '../../server/logger';
import User from '../user';

export default async function apply(params) {
    const { safe } = params;

    let macthed = 0;
    let modified = 0;

    const users = User.find({ $where: 'this.installations.length > 1' }).cursor();
    for (let user = await users.next(); user !== null; user = await users.next()) {
        macthed += 1;

        const res = [];
        for (let i = 0; i < user.installations.length; i += 1) {
            let installation = user.installations[i];
            for (let j = 0; j < user.installations.length; j += 1) {
                const newer = user.installations[j];
                if (installation.deviceToken === newer.deviceToken && newer.createdAt > installation.createdAt) {
                    installation = newer;
                }
            }
            if (!res.includes(installation)) {
                res.push(installation);
            }
        }

        if (!safe) {
            user.installations = res;
            await user.save();
            modified += 1;
        }
    }

    logger.info(`${macthed} users matched`);
    logger.info(`${modified} users updated`);
}
