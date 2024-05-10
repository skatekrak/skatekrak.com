import logger from '../../server/logger';
import Profile from '../profile';
import Spot from '../spot';

export default async function apply(params) {
    const { safe } = params;
    if (safe) {
        logger.warn('Safe mode => No safe mode for this method');
    } else {
        let profileSaved = 0;
        const profiles = Profile.find().cursor();
        for (let profile = await profiles.next(); profile !== null; profile = await profiles.next()) {
            await profile.computeMediasStat();
            await profile.computeClipsStat();
            await profile.computeTricksDoneStat();
            await profile.save();
            profileSaved += 1;
        }
        logger.info(`${profileSaved} profiles successfully computed and saved`);

        let spotSaved = 0;
        const spots = Spot.find().cursor();
        for (let spot = await spots.next(); spot !== null; spot = await spots.next()) {
            await spot.computeMediasStat();
            await spot.computeClipsStat();
            await spot.computeTricksDoneStat();
            await spot.save();
            spotSaved += 1;
        }
        logger.info(`${spotSaved} spots successfully computed and saved`);
    }
}
