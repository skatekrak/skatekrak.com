import { unique } from 'radash';
import { Category, CustomMapCategory, QuickAccessMap } from './types';

export const generateCategories = (data: QuickAccessMap[]): Category[] => {
    const categories: CustomMapCategory[] = unique(
        data
            .filter((value) => value.categories != null)
            .reduce((acc, value) => acc.concat(value.categories!), [] as CustomMapCategory[]),
    );

    const order = Object.keys(CustomMapCategory);
    const orderedCategories = categories.sort((a, b) => order.indexOf(a) - order.indexOf(b));

    return orderedCategories.map((category) => ({
        id: category,
        name: category,
        maps: data.filter((map) => map.categories?.some((cat) => cat === category)),
    }));
};
