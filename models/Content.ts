import { IContent, Media, Source } from 'rss-feed';

export default class Content implements IContent {
    public id: string;
    public createdAt: string;
    public updatedAt: string;
    public source: Source;
    public contentId: string;
    public title: string;
    public websiteURL: string;
    public thumbnailUrl: string;
    public rawSummary: string;
    public summary: string;
    public rawContent: string;
    public content: string;
    public author: string;
    public contentUrl: string;

    constructor(object: any) {
        this.id = object.id;
        this.createdAt = object.createdAt;
        this.updatedAt = object.updatedAt;
        this.source = object.source as Source;
        this.contentId = object.contentId;
        this.title = object.title;
        this.thumbnailUrl = object.thumbnailUrl;
        this.rawSummary = object.rawSummary;
        this.summary = object.summary;
        this.rawContent = object.rawContent;
        this.content = object.content;
        this.author = object.author;
        this.contentUrl = object.contentUrl;
    }

    public getImage(): string | null {
        if (this.thumbnailUrl) {
            return this.thumbnailUrl;
        }
        return null;
    }

    public getPlaceholder(): string {
        return this.source.coverUrl;
    }

    public getArticleUrl(): string {
        return this.contentUrl;
    }

    public getArticlePopupUrl(): string {
        return `${process.env.NEXT_PUBLIC_WEBSITE_URL}/news?id=${this.id}`;
    }

    public getWebsiteUrl(): string {
        return this.source.websiteUrl;
    }

    public getContent() {
        if (this.summary) {
            return this.summary;
        } else if (this.content) {
            return this.content;
        }
        return null;
    }
}
