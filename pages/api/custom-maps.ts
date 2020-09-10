import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import fs from 'fs';

import CustomMaps from '../../data/_spots';
import { CustomMap } from 'components/pages/map/MapCustom/MapCustomNavigationTrail/MapCustomNavigationTrail';

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
        const maps: CustomMap[] = [];

        for (const map of CustomMaps) {
            const data = await readFile(`./data/${map.file}`);
            const spots = JSON.parse(data);

            maps.push({
                id: map.id,
                name: map.name,
                subtitle: map.subtitle,
                about: map.about,
                edito: map.edito,
                numberOfSpots: spots.length,
            });
        }

        return res.status(200).json(maps);
    }

    if (typeof id !== 'string') {
        return res.status(402).json({ message: 'Wrong type of id' });
    }

    const customMap = CustomMaps.find((map) => map.id === id);
    if (customMap === undefined) {
        return res.status(404).json({ message: 'Map not found' });
    }

    const data = await readFile(`./data/${customMap.file}`);
    const spots = JSON.parse(data);

    delete customMap.file;

    res.status(200).json({
        ...customMap,
        spots,
    });
};

function readFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
