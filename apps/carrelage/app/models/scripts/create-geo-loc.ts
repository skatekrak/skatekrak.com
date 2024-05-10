import logger from '../../server/logger';
import Spot, { SpotDocument } from '../spot';

export default async function apply({ safe }: { safe: boolean }) {
    if (safe) {
        logger.warn('Safe mode => No safe mode for this method');
    } else {
        const spots = Spot.find({ geoLoc: { $exists: false } }).cursor();
        for (let spot = (await spots.next()) as SpotDocument; spot !== null; spot = await spots.next()) {
            spot.geoLoc = {
                type: 'Point',
                coordinates: spot.geo,
            };
            await spot.save();
        }
    }
}
