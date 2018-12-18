declare module 'rss-feed' {
    export enum SourceType {
        RSS = 'rss',
    }

    export interface Source {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: SourceType;
        label: string;
        title: string;
        logoUrl: string;
        webUrl: string;
    }

    export interface Content {
        id: string;
        createdAt: Date;
        updatedAt?: Date;
        source: Source;
        title: string;
        webUrl: string;
        guid?: string;
        content?: string;
        imageUrl?: string;
        author?: string;
        categories?: string[];
    }
}
