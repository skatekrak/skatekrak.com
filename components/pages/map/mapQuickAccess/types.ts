export interface QuickAccess {
    id: string;
    name: string;
    edito: string;
}

export interface QuickAccessMap extends QuickAccess {
    subtitle: string;
    about: string;
    categories?: CustomMapCategory[];
    numberOfSpots?: number;
}

export type Category = {
    id: string;
    name: string;
    maps: QuickAccessMap[];
};

export enum CustomMapCategory {
    maps = 'Maps',
    video = 'Video',
    skater = 'Skater',
    filmer = 'Filmer',
    photographer = 'Photographer',
    magazine = 'Magazine',
    skatepark = 'Skatepark',
}
