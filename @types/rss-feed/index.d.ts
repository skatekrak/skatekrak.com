declare module 'rss-feed' {
    import { SourceType, Order } from 'lib/constants';

    export interface Source {
        id: string;

        createdAt: Date;
        updatedAt: Date;
        type: SourceType;
        order: number;
        label: string;
        title: string;
        description: string;
        iconUrl: string;
        coverUrl: string;
        topics: string[];
        lang: Language;

        feedId: string;
        visualUrl: string;
        website: string;

        youtube: Youtube;
    }

    export interface Media {
        url: string;
        contentType: string;
    }

    export interface IContent {
        id: string;

        createdAt: string;
        updatedAt: string;
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
