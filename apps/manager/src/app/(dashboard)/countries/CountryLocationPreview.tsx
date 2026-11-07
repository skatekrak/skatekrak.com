'use client';

import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';

import { createCountryInput, type Country } from '@krak/contracts';

import { countryCatalog } from '@/data/countries';

export function CountryLocationPreview({
    bounds,
    code,
    disabled,
}: {
    bounds: Country['bounds'];
    code: string;
    disabled: boolean;
}) {
    const country = countryCatalog.find((entry) => entry.code === code);
    const valid = createCountryInput.shape.bounds.safeParse(bounds).success;
    const [[longitude1, latitude1], [longitude2, latitude2]] = bounds;

    return (
        <div className="flex flex-col gap-2">
            {valid ? (
                <div className="h-80 overflow-hidden rounded-lg border" inert={disabled}>
                    <Map
                        key={JSON.stringify(bounds)}
                        initialViewState={{
                            bounds: [
                                [Math.min(longitude1, longitude2), Math.min(latitude1, latitude2)],
                                [Math.max(longitude1, longitude2), Math.max(latitude1, latitude2)],
                            ],
                            fitBoundsOptions: { padding: 32 },
                        }}
                        minZoom={-2}
                        maxZoom={19}
                        transformConstrain={(center, zoom) => {
                            const boundedCenter = center.wrap();
                            boundedCenter.lat = Math.max(-85.051129, Math.min(85.051129, boundedCenter.lat));
                            return { center: boundedCenter, zoom: Math.max(-2, Math.min(19, zoom)) };
                        }}
                        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                    >
                        <NavigationControl position="top-right" showCompass={false} />
                        {country && Math.abs(country.latitude) <= 85.051129 && (
                            <Marker latitude={country.latitude} longitude={country.longitude} />
                        )}
                    </Map>
                </div>
            ) : (
                <p className="rounded-lg border p-6 text-sm text-muted-foreground">
                    Choose a country to preview its opening map view.
                </p>
            )}
            {country && (
                <p className="text-sm text-muted-foreground">
                    Representative position: {country.latitude}°, {country.longitude}°. The opening view uses the saved
                    bounds, not this point.
                </p>
            )}
        </div>
    );
}
