import { alphabetical, unique } from 'radash';

import { mapCategoryLabels } from '@krak/contracts';

import { type Category, type QuickAccessMap } from './types';

const labelValues = Object.values(mapCategoryLabels) as string[];
const labelOrder = Object.values(mapCategoryLabels);

export const generateCategories = (data: QuickAccessMap[]): Category[] => {
    const allCategories: string[] = unique(
        data
            .filter((value) => value.categories != null)
            .reduce((acc, value) => acc.concat(value.categories!), [] as string[]),
    );

    // Filter to only known category labels and preserve ordering
    const categories = allCategories
        .filter((cat) => labelValues.includes(cat))
        .toSorted((a, b) => labelOrder.indexOf(a) - labelOrder.indexOf(b));

    return categories.map((category) => ({
        id: category,
        name: category,
        maps: data.filter((map) => map.categories?.some((cat) => cat === category)),
    }));
};

export const sortMaps = (maps: QuickAccessMap[]) => alphabetical(maps, (map) => map.name);
