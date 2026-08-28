import { expect, test } from 'bun:test';

import { getSpotBoundsWhere } from './map-bounds';

test('builds longitude filters across the antimeridian', () => {
    expect(
        getSpotBoundsWhere({
            northEast: { latitude: 20, longitude: 190 },
            southWest: { latitude: -20, longitude: 170 },
        }),
    ).toEqual({
        latitude: { gte: -20, lte: 20 },
        OR: [{ longitude: { gte: 170 } }, { longitude: { lte: -170 } }],
    });
});
