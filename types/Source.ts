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
