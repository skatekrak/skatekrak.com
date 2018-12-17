import { Source } from './Source';

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
