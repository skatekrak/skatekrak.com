import logger from '../../server/logger';
import Spot from '../spot';
import { geocoder } from '../../controllers/spots';

export default async function apply(params) {
    const { safe } = params;

    const spots = await Spot.find({ $or: [{ location: null }, { location: {} }] }).exec();
    logger.info(`${spots.length} spots matched`);

    let updated = 0;
    if (!safe) {
        for (const spot of spots) {
            try {
                spot.location = await geocoder.reverse({
                    lat: spot.geo[1],
                    lon: spot.geo[0],
                });
            } catch (err) {
                spot.location = {};
            }
            await spot.save();
            updated += 1;
        }
    }
    logger.info(`${updated} spots updated`);
}
