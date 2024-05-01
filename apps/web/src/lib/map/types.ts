export interface City {
    id: string;
    name: string;
    edito: string;
    about: string;
    subtitle: string;
    bounds: [[number, number], [number, number]];
}

export interface CustomMap {
    id: string;
    name: string;
    categories: string[];
    subtitle: string;
    edito: string;
    about: string;
    videos: string[];
    staging: boolean;
}
