import logger from '../../server/logger';
import Spot, { SpotDocument, Obstacle } from '../spot';

export default async function apply(params: { safe: boolean }) {
    const { safe } = params;
    if (safe) {
        logger.warn('Safe mode => No safe mode for this method');
    } else {
        let spotSaved = 0;
        let obstaclesParsed = 0;

        const spots = Spot.find().cursor();
        for (let spot = (await spots.next()) as SpotDocument; spot !== null; spot = await spots.next()) {
            const normalizedName = spot.name.toLowerCase();
            const obstacles = new Set(spot.obstacles);

            for (const obs of Object.values(Obstacle)) {
                if (normalizedName.includes(obs)) {
                    obstaclesParsed += 1;
                    obstacles.add(obs);

                    // Dependencies
                    if (obs === Obstacle.Stairs) obstacles.add(Obstacle.Gap);
                    if (obs === Obstacle.StreetGap) obstacles.add(Obstacle.Gap);
                    if (obs === Obstacle.Spine) obstacles.add(Obstacle.Tranny);
                    if (obs === Obstacle.Ramp) obstacles.add(Obstacle.Tranny);
                    if (obs === Obstacle.Bowl) obstacles.add(Obstacle.Tranny);
                    if (obs === Obstacle.Quarterpipe) obstacles.add(Obstacle.Tranny);
                    if (obs === Obstacle.Fullpipe) obstacles.add(Obstacle.Tranny);
                }
            }

            // Exceptions
            obstaclesParsed += addException(obstacles, normalizedName, 'rail', Obstacle.Handrail);
            obstaclesParsed += addException(obstacles, normalizedName, 'curb', Obstacle.Ledge);
            obstaclesParsed += addException(obstacles, normalizedName, 'manual pad', Obstacle.MannyPad);
            obstaclesParsed += addException(obstacles, normalizedName, 'lowtohigh', Obstacle.LowToHigh);
            obstaclesParsed += addException(obstacles, normalizedName, 'flatrail', Obstacle.Flatbar);

            spot.obstacles = [...obstacles];
            await spot.save();
            spotSaved += 1;
        }
        logger.info(`${obstaclesParsed} obstacles parsed and ${spotSaved} saved spots`);
    }
}

function addException(obstacles: Set<Obstacle>, normalizedName: string, exceptionName: string, obs: Obstacle): number {
    if (normalizedName.includes(exceptionName)) {
        obstacles.add(obs);
        return 1;
    }
    return 0;
}
