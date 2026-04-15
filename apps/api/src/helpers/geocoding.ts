type AddressComponent = {
    long_name: string;
    short_name: string;
    types: string[];
};

type GeocodingResult = {
    address_components: AddressComponent[];
    formatted_address: string;
};

type GeocodingResponse = {
    results: GeocodingResult[];
    status: string;
};

export type SpotLocation = {
    streetNumber: string | null;
    streetName: string | null;
    city: string | null;
    country: string | null;
};

function findComponent(components: AddressComponent[], type: string): string | null {
    const match = components.find((c) => c.types.includes(type));
    return match?.long_name ?? null;
}

/**
 * Reverse-geocode a lat/lng pair into a street address using the Google Maps Geocoding API.
 * Returns null if no results are found.
 */
export async function reverseGeocode(
    latitude: number,
    longitude: number,
    apiKey: string,
): Promise<SpotLocation | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en`;
    const response = await fetch(url);
    const data = (await response.json()) as GeocodingResponse;

    if (data.status === 'ZERO_RESULTS') {
        return null;
    }

    if (data.status !== 'OK' || data.results.length === 0) {
        throw new Error(`Geocoding failed with status: ${data.status}`);
    }

    const result = data.results[0];
    if (!result) {
        return null;
    }

    const components = result.address_components;

    return {
        streetNumber: findComponent(components, 'street_number'),
        streetName: findComponent(components, 'route'),
        city: findComponent(components, 'locality') ?? findComponent(components, 'administrative_area_level_1'),
        country: findComponent(components, 'country'),
    };
}
