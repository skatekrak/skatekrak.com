import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

import { Place, placeAutocomplete, getPlace } from 'lib/placeApi';

const cors = Cors({
    methods: ['GET', 'HEAD'],
    origin: '/.skatekrak.com$/',
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Must be a GET' });
    }

    const input = req.query.input;

    if (Array.isArray(input)) {
        return res.status(402).json({ message: 'Wrong type of input' });
    }

    if (!input) {
        return res.status(400).json({ message: 'Missing input' });
    }

    const placesName = (await placeAutocomplete(input as string)).slice(0, 3);

    const results = await Promise.all(placesName.map((place) => getPlace(place.id)));

    const places: Place[] = [];

    for (let i = 0; i < results.length; i++) {
        const { geometry, place_id } = results[i].result;
        const placeName = placesName[i];
        places.push({
            ...placeName,
            geometry,
        });
    }

    res.status(200).json(places);
};
