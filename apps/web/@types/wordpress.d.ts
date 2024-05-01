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
        id: number;
        title: string;
        date: string;
        date_gmt: string;
        slug: string;
        content: string;
        featuredImages: {
            source_url: string;
        }[];
        video?: string;
        tags: string[];
        categories: string[];
    }
}
