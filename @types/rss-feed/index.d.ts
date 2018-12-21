declare module 'rss-feed' {
    export enum SourceType {
        RSS = 'rss',
    }

    export interface Source {
        id: string;

        createdAt: Date;
        updatedAt: Date;
        type: SourceType;
        order: number;
        label: string;

        feedId: string;
        title: string;
        description: string;

        iconUrl: string;
        coverUrl: string;
        visualUrl: string;

        topics: string[];
        website: string;
    }

    export interface Media {
        url: string;
        contentType: string;
    }

    export interface Content {
        id: string;

        createdAt: Date;
        updatedAt: Date;
        source: Source;
        contentId: string;
        title: string;
        webUrl: string;

        media: Media;

        rawSummary: string;
        summary: string;
        rawContent: string;
        content: string;

        author: string;
        keywords: string[];
    }
}
