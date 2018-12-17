import { ISource } from './Source';

export interface Content {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    source: ISource;
    guid: string;
    title: string;
    webUrl: string;
    summary?: string;
    description?: string;
    imageUrl?: string;
    author?: string;
    categories?: string[];
}
