import { unique } from 'radash';
import { Category, CustomMapCategory, QuickAccessMap } from './types';

const customMapCategoryValues = Object.values(CustomMapCategory) as string[];

export const generateCategories = (data: QuickAccessMap[]): Category[] => {
    const allCategories: string[] = unique(
        data
            .filter((value) => value.categories != null)
            .reduce((acc, value) => acc.concat(value.categories!), [] as string[]),
    );

    // Filter to only known CustomMapCategory values and preserve ordering
    const order = Object.keys(CustomMapCategory);
    const categories = allCategories
        .filter((cat): cat is CustomMapCategory => customMapCategoryValues.includes(cat))
        .sort((a, b) => order.indexOf(a) - order.indexOf(b));

    return categories.map((category) => ({
        id: category,
        name: category,
        maps: data.filter((map) => map.categories?.some((cat) => cat === category)),
    }));
};
