declare module 'wordpress-types' {
    export interface WordpressCategory {
        id: number;
        count: number;
        description: string;
        name: string;
        slug: string;
        taxonomy: string;
    }

    export interface Post {
        id?: number;
        title?: { rendered?: string };
        slug?: string;
        link?: string;
        date?: string;
        date_gmt?: string;
        modified_gmt?: string;
        content?: { rendered?: string };
        excerpt?: { rendered?: string };
        featured_media?: number;
        thumbnailImage?: string;
        featuredImageFull?: string;
        _format_video_embed?: string;
        categories?: number[];
        categoriesString?: string;
        _embedded?: Record<string, any>;
    }
}
