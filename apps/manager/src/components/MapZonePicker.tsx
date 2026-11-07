'use client';

import { useRef } from 'react';
import Map, { Layer, Marker, NavigationControl, Source, type MapRef } from 'react-map-gl/maplibre';

type Bounds = [[number, number], [number, number]];

export function MapZonePicker({
    bounds,
    onChange,
    disabled = false,
}: {
    bounds: Bounds;
    onChange: (bounds: Bounds) => void;
    disabled?: boolean;
}) {
    const mapRef = useRef<MapRef>(null);
    const [[longitude1, latitude1], [longitude2, latitude2]] = bounds;
    const empty = longitude1 === longitude2 && latitude1 === latitude2;
    const corners: [number, number][] = [
        [longitude1, latitude1],
        [longitude2, latitude1],
        [longitude2, latitude2],
        [longitude1, latitude2],
    ];
    const zone = {
        type: 'Feature' as const,
        properties: {},
        geometry: { type: 'Polygon' as const, coordinates: [[...corners, corners[0]]] },
    };

    function positionZone(longitude: number, latitude: number) {
        const visibleBounds = mapRef.current?.getBounds();
        if (disabled || !visibleBounds) return;
        const latitudeRadius =
            Math.abs(latitude2 - latitude1) / 2 || (visibleBounds.getNorth() - visibleBounds.getSouth()) / 8;
        const longitudeRadius =
            Math.abs(longitude2 - longitude1) / 2 || (visibleBounds.getEast() - visibleBounds.getWest()) / 8;
        onChange([
            [Math.max(-180, longitude - longitudeRadius), Math.max(-85.051129, latitude - latitudeRadius)],
            [Math.min(180, longitude + longitudeRadius), Math.min(85.051129, latitude + latitudeRadius)],
        ]);
    }

    function moveCorner(index: number, longitude: number, latitude: number) {
        if (disabled) return;
        longitude = Math.max(-180, Math.min(180, longitude));
        latitude = Math.max(-85.051129, Math.min(85.051129, latitude));
        if (index === 0) onChange([[longitude, latitude], bounds[1]]);
        if (index === 1)
            onChange([
                [longitude1, latitude],
                [longitude, latitude2],
            ]);
        if (index === 2) onChange([bounds[0], [longitude, latitude]]);
        if (index === 3)
            onChange([
                [longitude, latitude1],
                [longitude2, latitude],
            ]);
    }

    return (
        <div
            className="h-[32rem] overflow-hidden rounded-lg border"
            inert={disabled}
            onKeyDown={(event) => {
                if (!(event.target instanceof HTMLCanvasElement) || !['Enter', ' '].includes(event.key)) return;
                event.preventDefault();
                const center = mapRef.current?.getCenter().wrap();
                if (center) positionZone(center.lng, center.lat);
            }}
        >
            <Map
                ref={mapRef}
                initialViewState={
                    empty
                        ? { longitude: 0, latitude: 20, zoom: 1.5 }
                        : {
                              bounds: [
                                  [Math.min(longitude1, longitude2), Math.min(latitude1, latitude2)],
                                  [Math.max(longitude1, longitude2), Math.max(latitude1, latitude2)],
                              ],
                              fitBoundsOptions: { padding: 48 },
                          }
                }
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                onClick={(event) => {
                    const center = event.lngLat.wrap();
                    positionZone(center.lng, center.lat);
                }}
            >
                <NavigationControl position="top-right" showCompass={false} />
                {!empty && (
                    <Source id="destination-zone" type="geojson" data={zone}>
                        <Layer
                            id="destination-zone-fill"
                            type="fill"
                            paint={{ 'fill-color': '#2563eb', 'fill-opacity': 0.2 }}
                        />
                        <Layer
                            id="destination-zone-outline"
                            type="line"
                            paint={{ 'line-color': '#1d4ed8', 'line-width': 2 }}
                        />
                    </Source>
                )}
                {!empty &&
                    corners.map(([longitude, latitude], index) => (
                        <Marker
                            key={index}
                            ref={(marker) => {
                                marker?.getElement().setAttribute('role', 'group');
                            }}
                            longitude={longitude}
                            latitude={latitude}
                            draggable={!disabled}
                            onDragEnd={(event) => moveCorner(index, event.lngLat.lng, event.lngLat.lat)}
                        >
                            <button
                                type="button"
                                className="size-4 cursor-move rounded-sm border-2 border-white bg-blue-600 shadow focus-visible:outline-2 focus-visible:outline-offset-2"
                                aria-label={`Zone corner ${index + 1}: drag or use arrow keys`}
                                onClick={(event) => event.stopPropagation()}
                                onKeyDown={(event) => {
                                    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key))
                                        return;
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const longitudeStep = Math.abs(longitude2 - longitude1) / 50;
                                    const latitudeStep = Math.abs(latitude2 - latitude1) / 50;
                                    moveCorner(
                                        index,
                                        longitude +
                                            (event.key === 'ArrowLeft'
                                                ? -longitudeStep
                                                : event.key === 'ArrowRight'
                                                  ? longitudeStep
                                                  : 0),
                                        latitude +
                                            (event.key === 'ArrowDown'
                                                ? -latitudeStep
                                                : event.key === 'ArrowUp'
                                                  ? latitudeStep
                                                  : 0),
                                    );
                                }}
                            />
                        </Marker>
                    ))}
            </Map>
        </div>
    );
}
