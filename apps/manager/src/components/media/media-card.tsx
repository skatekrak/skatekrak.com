import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Film, Image } from 'lucide-react';

import { Badge, Card, CardContent, KrakImage, Skeleton } from '@krak/ui';

import type { Media } from './types';

export function MediaThumbnail({ image, alt }: { image: Media['image']; alt: string }) {
    if (image == null) return null;
    if ('key' in image && image.key) {
        return (
            <KrakImage
                path={image.key}
                alt={alt}
                options={{ width: 400, height: 400, resizingType: 'fill', format: 'webp' }}
                className="size-full object-cover"
            />
        );
    }
    if ('url' in image && image.url) {
        return <img src={image.url} alt={alt} className="size-full object-cover" />;
    }
    return null;
}

export function hasDisplayableImage(image: Media['image']): boolean {
    if (image == null) return false;
    if ('key' in image && image.key) return true;
    if ('url' in image && image.url) return true;
    return false;
}

export function MediaCard({ media, onClick }: { media: Media; onClick: () => void }) {
    return (
        <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg" onClick={onClick}>
            <div className="relative aspect-square bg-muted">
                {hasDisplayableImage(media.image) ? (
                    <>
                        <MediaThumbnail image={media.image} alt={media.caption || 'Media'} />
                        {media.type === 'VIDEO' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Film className="size-8 text-white" />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex size-full items-center justify-center">
                        {media.type === 'VIDEO' ? (
                            <Film className="size-8 text-muted-foreground" />
                        ) : (
                            <Image className="size-8 text-muted-foreground" />
                        )}
                    </div>
                )}
                <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    {media.type}
                </Badge>
            </div>
            <CardContent className="flex flex-col gap-1 p-3">
                <p className="truncate text-sm font-medium">{media.caption || 'No caption'}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {media.spot ? <span className="truncate">{media.spot.name}</span> : <span>No spot</span>}
                    {media.addedBy && (
                        <>
                            <span>·</span>
                            <span className="truncate">{media.addedBy.username}</span>
                        </>
                    )}
                </div>
                {media.releaseDate && new Date(media.releaseDate) > new Date() ? (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                        <Calendar className="size-3" />
                        {format(new Date(media.releaseDate), 'MMM d, yyyy')}
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })}
                    </span>
                )}
            </CardContent>
        </Card>
    );
}

export function MediaCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="flex flex-col gap-2 p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </CardContent>
        </Card>
    );
}
