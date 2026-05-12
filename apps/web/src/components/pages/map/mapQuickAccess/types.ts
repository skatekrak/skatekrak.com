export interface QuickAccess {
    id: string;
    name: string;
    edito: string | null;
}

export interface QuickAccessMap extends QuickAccess {
    subtitle: string | null;
    about: string | null;
    categories?: string[];
    numberOfSpots?: number;
}

export type Category = {
    id: string;
    name: string;
    maps: QuickAccessMap[];
};

export { mapCategoryLabels, mapCategories, type MapCategory } from '@krak/contracts';
