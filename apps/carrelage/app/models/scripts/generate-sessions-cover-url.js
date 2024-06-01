import Session from '../session';
import { generateAndUploadStaticMap } from '../../controllers/sessions';
import logger from '../../server/logger';

/**
 * Generate coverURL for sessions which don't have one
 */
export default async function apply(params) {
    const { safe } = params;
    let matched = 0;
    let updated = 0;

    const findAll = Session.find({ coverURL: { $exists: false } }).cursor();

    for (let session = await findAll.next(); session !== null; session = await findAll.next()) {
        if (!session.coverURL) {
            matched += 1;
            if (!safe) {
                const url = await generateAndUploadStaticMap(session.spots, session.getFilename());
                session.coverURL = url;
                await session.save();
                updated += 1;
            }
        }
    }

    logger.info(`${matched} sessions matched`);
    logger.info(`${updated} sessions updated`);
}
