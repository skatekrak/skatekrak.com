import { Category, CustomMapCategory, QuickAccessMap } from './types';

export const generateCategories = (data: QuickAccessMap[]): Category[] => {
    const categories: CustomMapCategory[] = data.reduce((acc, value) => acc.concat(value.categories), []);
    const uniqueCategories: CustomMapCategory[] = categories.filter(
        (category, i, a) => a.findIndex((v) => v === category) === i,
    );

    const order = Object.keys(CustomMapCategory);
    const orderedCategories = uniqueCategories.sort((a, b) => order.indexOf(a) - order.indexOf(b));

    return orderedCategories.map((category) => ({
        id: category,
        name: CustomMapCategory[category],
        maps: data.filter((map) => map.categories.some((cat) => cat === category)),
    }));
};

export function generateCustomMapSrcSet(id: string): string {
    return `
        /images/map/custom-maps/${id}.png 1x,
        /images/map/custom-maps/${id}@2x.png 2x,
        /images/map/custom-maps/${id}@3x.png 3x
    `;
}

export function generateCitySrcSet(id: string): string {
    return `
        /images/map/cities/${id}.jpg 1x,
        /images/map/cities/${id}@2x.jpg 2x,
        /images/map/cities/${id}@3x.jpg 3x
    `;
}
