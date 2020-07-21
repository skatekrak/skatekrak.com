import axios from 'axios';

export type Place = {
    name: string;
    id: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
};

export const placeApiClient = axios.create({
    baseURL: `https://maps.googleapis.com/maps/api/place`,
});

export const placeAutocomplete = async (query: string): Promise<{ name: string; id: string }[]> => {
    const res = await placeApiClient.get('/autocomplete/json', {
        params: {
            input: query,
            types: '(cities)',
            key: process.env.PLACE_API,
        },
    });

    const { predictions } = res.data;
    if (!predictions) {
        return [];
    }

    const places = predictions.map((prediction) => ({
        name: prediction.description,
        id: prediction.place_id,
    }));

    return places;
};

export const getPlace = async (placeId: string): Promise<any> => {
    const res = await placeApiClient('/details/json', {
        params: {
            place_id: placeId,
            fields: 'geometry,place_id',
            key: process.env.PLACE_API,
        },
    });

    return res.data;
};
