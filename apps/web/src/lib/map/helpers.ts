import type { contract, ContractInputs } from '@krak/contracts';
import { type SpotGeoJSON, Status } from '@krak/types';

import type { InferContractRouterOutputs } from '@orpc/contract';
import type { Map } from 'maplibre-gl';

type Spot = InferContractRouterOutputs<typeof contract>['spots']['getSpot'];
type MapBounds = ContractInputs['spots']['getSpotsGeoJSON'];

export type MapPadding = {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
};

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
        [southWestLongitude, southWestLatitude],
        [northEastLongitude, northEastLatitude],
    ];
};

export const findSpotsBoundsCoordinate = (spots: Spot[]): [[number, number], [number, number]] => {
    const northEastLatitude = Math.max(...spots.map((s) => s.location.latitude));
    const northEastLongitude = Math.max(...spots.map((s) => s.location.longitude));
    const southWestLatitude = Math.min(...spots.map((s) => s.location.latitude));
    const southWestLongitude = Math.min(...spots.map((s) => s.location.longitude));

    return [
        [southWestLongitude, southWestLatitude],
        [northEastLongitude, northEastLatitude],
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

export const getVisibleMapBounds = (map: Map, padding: MapPadding = {}): MapBounds => {
    const left = padding.left ?? 0;
    const top = padding.top ?? 0;
    const right = padding.right ?? 0;
    const bottom = padding.bottom ?? 0;

    if (left === 0 && top === 0 && right === 0 && bottom === 0) {
        const mapBounds = map.getBounds();
        return {
            northEast: {
                latitude: mapBounds.getNorthEast().lat,
                longitude: mapBounds.getNorthEast().lng,
            },
            southWest: {
                latitude: mapBounds.getSouthWest().lat,
                longitude: mapBounds.getSouthWest().lng,
            },
        };
    }

    const canvas = map.getCanvas();
    const southWest = map.unproject([left, canvas.clientHeight - bottom]);
    const northEast = map.unproject([canvas.clientWidth - right, top]);

    return {
        northEast: {
            latitude: northEast.lat,
            longitude: northEast.lng,
        },
        southWest: {
            latitude: southWest.lat,
            longitude: southWest.lng,
        },
    };
};

export const spotToGeoJSON = (spot: Spot): SpotGeoJSON => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [spot.location.longitude, spot.location.latitude],
        },
        properties: {
            id: spot.id,
            name: spot.name,
            type: spot.status === Status.Active ? spot.type : spot.status,
            indoor: spot.indoor,
            tags: spot.tags,
            mediasStat: spot.mediasStat,
        },
    };
};
