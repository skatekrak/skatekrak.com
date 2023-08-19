declare module 'map' {
    interface City {
        id: string;
        name: string;
        edito: string;
        about: string;
        subtitle: string;
        bounds: [[number, number], [number, number]];
    }

    interface CustomMap {
        id: string;
        name: string;
        categories: string[];
        subtitle: string;
        edito: string;
        about: string;
        spots: Spot[];
        videos: string[];
        staging: boolean;
    }
}
