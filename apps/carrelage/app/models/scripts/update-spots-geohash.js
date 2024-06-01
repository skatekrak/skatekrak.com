import ngeohash from 'ngeohash';

import logger from '../../server/logger';
import Spot from '../spot';

export default async function apply(params) {
    const { safe } = params;

    const spots = await Spot.find({
        geoHash: { $exists: true },
        $where: `this.geoHash.length !== ${Spot.GEOHASH_LENGTH}`,
    });
    logger.info(`${spots.length} spots with geoHash length different from ${Spot.GEOHASH_LENGTH}`);

    if (safe) {
        logger.info('Safe mode => No spot are updated');
    } else {
        let saved = 0;
        for (const spot of spots) {
            spot.geoHash = ngeohash.encode(spot.geo[0], spot.geo[1], Spot.GEOHASH_LENGTH);
            await spot.save();
            saved += 1;
        }
        logger.info(`${saved} spots successfully saved`);
    }
}
