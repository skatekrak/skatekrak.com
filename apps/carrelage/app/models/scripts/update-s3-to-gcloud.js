import config from '../../server/config';
import logger from '../../server/logger';
import Contest from '../contest';
import Session from '../session';
import Spot from '../spot';

function getLastPart(url) {
    const array = url.split('/');
    return array[array.length - 1];
}

export default async function apply(params) {
    const { safe } = params;

    const SPOTS_CDN_PRE = `${config.GCLOUD_CDN_URL}/app-prod/spots/`;
    const SESSIONS_CDN_PRE = `${config.GCLOUD_CDN_URL}/app-prod/sessions/`;
    const CONTESTS_CDN_PRE = `${config.GCLOUD_CDN_URL}/app-prod/contests/`;

    let nbSpots = 0;
    let nbSpotsUpdated = 0;
    const s3Spots = Spot.find({
        $or: [
            { coverURL: { $regex: /^https:\/\/s3.eu-central-1.amazonaws.com/ } },
            { coverURL: { $regex: /^https:\/\/d1071ajlvxia0u.cloudfront.net/ } },
        ],
    }).cursor();
    for (let spot = await s3Spots.next(); spot !== null; spot = await s3Spots.next()) {
        nbSpots += 1;
        if (!safe) {
            spot.coverURL = SPOTS_CDN_PRE + getLastPart(spot.coverURL);
            await spot.save();
            nbSpotsUpdated += 1;
        }
    }
    logger.info(`${nbSpots} spots matched`);
    logger.info(`${nbSpotsUpdated} spots updated`);

    let nbSessions = 0;
    let nbSessionsUpdated = 0;
    const s3Sessions = Session.find({
        $or: [
            { coverURL: { $regex: /^https:\/\/s3.eu-central-1.amazonaws.com/ } },
            { coverURL: { $regex: /^https:\/\/d1071ajlvxia0u.cloudfront.net/ } },
        ],
    }).cursor();
    for (let session = await s3Sessions.next(); session !== null; session = await s3Sessions.next()) {
        nbSessions += 1;
        if (!safe) {
            session.coverURL = SESSIONS_CDN_PRE + getLastPart(session.coverURL);
            await session.save();
            nbSessionsUpdated += 1;
        }
    }
    logger.info(`${nbSessions} sessions matched`);
    logger.info(`${nbSessionsUpdated} sessions updated`);

    let nbContests = 0;
    let nbContestsUpdated = 0;
    const s3Contests = Contest.find({
        $or: [
            { logoURL: { $regex: /^https:\/\/s3.eu-central-1.amazonaws.com/ } },
            { logoURL: { $regex: /^https:\/\/d1071ajlvxia0u.cloudfront.net/ } },
        ],
    }).cursor();
    for (let contest = await s3Contests.next(); contest !== null; contest = await s3Contests.next()) {
        nbContests += 1;
        if (!safe) {
            contest.logoURL = CONTESTS_CDN_PRE + getLastPart(contest.logoURL);
            await contest.save();
            nbContestsUpdated += 1;
        }
    }
    logger.info(`${nbContests} contests matched`);
    logger.info(`${nbContestsUpdated} contests updated`);
}
