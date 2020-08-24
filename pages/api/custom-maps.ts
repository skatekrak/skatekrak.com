import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

import CustomMaps from './_spots';

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

    const id = req.query.id;
    if (id === undefined) {
        return res.status(400).json({ message: 'Missing id' });
    }

    if (typeof id !== 'string') {
        return res.status(402).json({ message: 'Wrong type of id' });
    }

    const customMap = CustomMaps.find((map) => map.id === id);
    if (customMap === undefined) {
        return res.status(404).json({ message: 'Map not found' });
    }

    res.status(200).json(customMap);
};
