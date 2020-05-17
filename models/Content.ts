import { IContent, Media, Source } from 'rss-feed';

export default class Content implements IContent {
    public id: string;
    public createdAt: string;
    public updatedAt: string;
    public source: Source;
    public contentId: string;
    public title: string;
    public webUrl: string;
    public media: Media;
    public rawSummary: string;
    public summary: string;
    public rawContent: string;
    public content: string;
    public author: string;
    public keywords: string[];

    constructor(object: any) {
        this.id = object.id;
        this.createdAt = object.createdAt;
        this.updatedAt = object.updatedAt;
        this.source = object.source as Source;
        this.contentId = object.contentId;
        this.title = object.title;
        this.webUrl = object.webUrl;

        if (object.media) {
            this.media = object.media as Media;
        }
        this.rawSummary = object.rawSummary;
        this.summary = object.summary;
        this.rawContent = object.rawContent;
        this.content = object.content;
        this.author = object.author;
        this.keywords = object.keywords;
    }

    public getImage(): string | null {
        if (this.media && this.media.url) {
            return `${process.env.NEXT_PUBLIC_CACHING_URL}/${encodeURIComponent(this.media.url)}`;
        }
        return null;
    }

    public getPlaceholder(): string {
        return this.source.coverUrl;
    }

    public getArticleUrl(): string {
        return `${process.env.NEXT_PUBLIC_REDIRECT_URL}/${encodeURIComponent(this.webUrl)}`;
    }

    public getArticlePopupUrl(): string {
        return `${process.env.NEXT_PUBLIC_NEXT_PUBLIC_WEBSITE_URL}/news?id=${this.id}`;
    }

    public getWebsiteUrl(): string {
        return `${process.env.NEXT_PUBLIC_REDIRECT_URL}/${encodeURIComponent(this.source.website)}`;
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
