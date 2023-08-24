import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import fs from 'fs';

import { Spot } from 'lib/carrelageClient';
import { CustomMapCategory, QuickAccessMap } from 'components/pages/map/mapQuickAccess/types';
import { CustomMap } from 'map';
import path from 'path';

const computeContentScore = (spot: Spot): number => {
    return spot.mediasStat.all + spot.clipsStat.all;
};

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
    const directory = path.join(process.cwd(), 'data', 'customMaps');
    const CustomMaps: CustomMap[] = JSON.parse(fs.readFileSync(directory + '/_spots.json', 'utf8'));
    const customMaps = CustomMaps.filter((map) => {
        if (process.env.NEXT_PUBLIC_STAGE === 'production') {
            return !map.staging;
        }
        return true;
    }).map((map) => {
        return {
            ...map,
            spots: JSON.parse(fs.readFileSync(`./data/customMaps/${map.id}.json`, 'utf8')),
        };
    });

    const id = req.query.id;
    if (id === undefined) {
        const maps: QuickAccessMap[] = [];

        for (const map of customMaps) {
            maps.push({
                id: map.id,
                name: map.name,
                subtitle: map.subtitle,
                about: map.about,
                edito: map.edito,
                categories: map.categories as CustomMapCategory[],
                numberOfSpots: map.spots.length,
            });
        }

        return res.status(200).json(maps);
    }

    if (typeof id !== 'string') {
        return res.status(402).json({ message: 'Wrong type of id' });
    }

    const customMap = CustomMaps.find((map) => map.id === id);
    customMap.spots = customMap.spots.sort((a: Spot, b: Spot) => computeContentScore(b) - computeContentScore(a));
    if (customMap === undefined) {
        return res.status(404).json({ message: 'Map not found' });
    }

    res.status(200).json(customMap);
};
