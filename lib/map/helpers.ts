/**
 *
 * @param coordinates Array of coordinates
 * @returns
 */
export const findBoundsCoordinate = (coordinates: [number, number][]): [[number, number], [number, number]] => {
    const northEastLatitude = Math.max(...coordinates.map((c) => c[1]));
    const northEastLongitude = Math.max(...coordinates.map((c) => c[0]));
    const southWestLatitude = Math.min(...coordinates.map((c) => c[1]));
    const southWestLongitude = Math.min(...coordinates.map((c) => c[0]));

    return [
        [northEastLongitude, northEastLatitude],
        [southWestLongitude, southWestLatitude],
    ];
};

export const centerFromBounds = (
    bounds: [[number, number], [number, number]],
): { latitude: number; longitude: number } => {
    const centerLongitude = (bounds[1][0] + bounds[0][0]) / 2;
    const centerLatitude = (bounds[1][1] + bounds[0][1]) / 2;

    return {
        latitude: centerLatitude,
        longitude: centerLongitude,
    };
};
