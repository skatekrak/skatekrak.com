declare module 'wordpress-types' {
    export interface WordpressCategory {
        id: number;
        count: number;
        description: string;
        name: string;
        slug: string;
        taxonomy: string;
    }
}
