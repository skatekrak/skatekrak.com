declare module 'map' {
    interface City {
        id: string;
        name: string;
        edito: string;
        about: string;
        subtitle: string;
        bounds: [[number, number], [number, number]];
    }
}
