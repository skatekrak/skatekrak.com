declare module 'rss-feed' {
    import { SourceType, Order } from 'lib/constants';

    export interface Source {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        sourceType: SourceType;
        order: number;
        shortTitle: string;
        title: string;
        description: string;
        iconUrl: string;
        coverUrl: string;
        lang: Language;
        website: string;
        sourceId: string;
    }

    export interface Media {
        url: string;
        contentType: string;
    }

    export interface Pagination<T> {
        perPage: number;
        page: number;
        totalResults: number;
        totalPages: number;
        items: T[];
    }

    export interface IContent {
        id: string;
        createdAt: string;
        updatedAt: string;
        source: Source;
        contentId: string;
        title: string;
        websiteURL: string;
        thumbnailUrl: string;
        rawSummary: string;
        summary: string;
        rawContent: string;
        content: string;

        author: string;
    }

    export interface Video {
        id: string;
        createdAt: string;
        updatedAt: string;
        order: Order;
        source: Source;
        videoId: string;
        title: string;
        description: string;
        thumbnail: string;
    }

    export interface Language {
        name: string;
        isoCode: string;
        image: string;
    }

    export interface Youtube {
        channelId: string;
        publishedAt: Date;
        country: string;
    }
}
