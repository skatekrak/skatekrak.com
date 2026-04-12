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

export enum CustomMapCategory {
    maps = 'Maps',
    video = 'Video',
    skater = 'Skaters',
    filmer = 'Filmers',
    photographer = 'Photographers',
    magazine = 'Magazines',
    skatepark = 'Skateparks',
    shop = 'Shops',
    years = 'Years',
    greatest = 'Greatest',
    members = 'Members',
    artist = 'Artists',
}
