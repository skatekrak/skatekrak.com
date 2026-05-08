'use client';

import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { Film, Image, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import {
    Badge,
    Card,
    CardContent,
    DataTablePagination,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    KrakImage,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Skeleton,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

type Media = ContractOutputs['admin']['media']['list']['media'][number];

const mediaTypes = ['IMAGE', 'VIDEO'] as const;

function scrollToTop() {
    requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
}

export default function MediaPage() {
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [type, setType] = useQueryState('type', parseAsStringLiteral(mediaTypes));
    const [selectedMediaId, setSelectedMediaId] = useQueryState('media', parseAsString);

    const perPage = 24;

    const { data, isLoading } = useQuery(
        orpc.admin.media.list.queryOptions({
            input: {
                page,
                perPage,
                sortBy: 'createdAt',
                sortOrder: 'desc',
                type: type ?? undefined,
            },
        }),
    );

    const totalPages = data ? Math.ceil(data.total / perPage) : 0;

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage);
            scrollToTop();
        },
        [setPage],
    );

    function handleTypeChange(value: string) {
        setType(value === 'all' ? null : (value as (typeof mediaTypes)[number]));
        handlePageChange(1);
    }

    return (
        <>
            <SiteHeader title="Media" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {/* Filters */}
                <div className="flex items-center gap-3">
                    <Select value={type ?? 'all'} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="IMAGE">Image</SelectItem>
                            <SelectItem value="VIDEO">Video</SelectItem>
                        </SelectContent>
                    </Select>
                    {data && (
                        <span className="text-sm text-muted-foreground">{data.total.toLocaleString()} media total</span>
                    )}
                </div>

                {/* Card grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: perPage }).map((_, i) => (
                            <MediaCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {data?.media.map((m) => (
                            <MediaCard key={m.id} media={m} onClick={() => setSelectedMediaId(m.id)} />
                        ))}
                    </div>
                )}

                {/* Bottom pagination */}
                {data && totalPages > 1 && (
                    <DataTablePagination
                        page={page}
                        totalPages={totalPages}
                        total={data.total}
                        perPage={perPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {/* Media detail modal */}
            <MediaDetailDialog
                mediaId={selectedMediaId}
                mediaList={data?.media}
                onClose={() => setSelectedMediaId(null)}
            />
        </>
    );
}

// ============================================================================
// Media detail dialog
// ============================================================================

function MediaDetailDialog({
    mediaId,
    mediaList,
    onClose,
}: {
    mediaId: string | null;
    mediaList: Media[] | undefined;
    onClose: () => void;
}) {
    // Try to resolve from the current list first
    const listMedia = useMemo(
        () => (mediaId ? mediaList?.find((m) => m.id === mediaId) : undefined),
        [mediaId, mediaList],
    );

    // Fetch full media detail (needed for video URL, and as fallback when not in list)
    const { data: fullMedia } = useQuery({
        ...orpc.media.getById.queryOptions({ input: { id: mediaId ?? '' } }),
        enabled: mediaId != null,
    });

    // Use list data for basic fields, full data for video URL
    const media =
        listMedia ??
        (fullMedia
            ? {
                  id: fullMedia.id,
                  type: fullMedia.type.toUpperCase() as Media['type'],
                  caption: fullMedia.caption ?? null,
                  image: fullMedia.image ?? null,
                  spot: fullMedia.spot ? { id: fullMedia.spot.id, name: fullMedia.spot.name } : null,
                  addedBy: fullMedia.addedBy ? { username: fullMedia.addedBy.username } : null,
                  createdAt: fullMedia.createdAt,
              }
            : null);

    const videoUrl = fullMedia?.video?.url;

    return (
        <Dialog open={mediaId != null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
                {media && (
                    <>
                        {/* Media preview */}
                        <div className="relative bg-black">
                            {media.type === 'VIDEO' ? (
                                <MediaVideoPlayer videoUrl={videoUrl} image={media.image} />
                            ) : (
                                <MediaFullImage image={media.image} alt={media.caption || 'Media'} />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-4 p-6">
                            <DialogHeader>
                                <div className="flex items-center gap-2">
                                    <DialogTitle className="flex-1">{media.caption || 'No caption'}</DialogTitle>
                                    <Badge variant="outline">{media.type}</Badge>
                                </div>
                                <DialogDescription className="sr-only">
                                    Media detail for {media.caption || media.id}
                                </DialogDescription>
                            </DialogHeader>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {media.spot && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 shrink-0 text-muted-foreground" />
                                        <Link
                                            href={`/spots/${media.spot.id}`}
                                            className="truncate text-foreground hover:underline"
                                            onClick={onClose}
                                        >
                                            {media.spot.name}
                                        </Link>
                                    </div>
                                )}
                                {media.addedBy && (
                                    <div className="flex items-center gap-2">
                                        <User className="size-4 shrink-0 text-muted-foreground" />
                                        <Link
                                            href={`/users/${media.addedBy.username}`}
                                            className="truncate text-foreground hover:underline"
                                            onClick={onClose}
                                        >
                                            {media.addedBy.username}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{format(new Date(media.createdAt), 'PPP p')}</span>
                                <span>({formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })})</span>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                <span className="font-medium">ID:</span> {media.id}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function MediaVideoPlayer({ videoUrl, image }: { videoUrl: string | undefined; image: Media['image'] }) {
    if (!videoUrl) {
        // Loading state — show thumbnail as placeholder
        return (
            <div className="relative flex aspect-video items-center justify-center bg-muted">
                {hasDisplayableImage(image) ? (
                    <>
                        <MediaFullImage image={image} alt="Video thumbnail" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Skeleton className="size-12 rounded-full" />
                        </div>
                    </>
                ) : (
                    <Skeleton className="size-12 rounded-full" />
                )}
            </div>
        );
    }

    return (
        <video controls autoPlay className="aspect-video w-full bg-black" preload="metadata">
            <source src={videoUrl} />
        </video>
    );
}

function MediaFullImage({ image, alt }: { image: Media['image']; alt: string }) {
    if (image == null) {
        return (
            <div className="flex aspect-video items-center justify-center bg-muted">
                <Image className="size-12 text-muted-foreground" />
            </div>
        );
    }
    if ('key' in image && image.key) {
        return (
            <KrakImage
                path={image.key}
                alt={alt}
                options={{ width: 800, height: 800, resizingType: 'fit', format: 'webp' }}
                className="w-full object-contain"
            />
        );
    }
    if ('url' in image && image.url) {
        return <img src={image.url} alt={alt} className="w-full object-contain" />;
    }
    return (
        <div className="flex aspect-video items-center justify-center bg-muted">
            <Image className="size-12 text-muted-foreground" />
        </div>
    );
}

// ============================================================================
// Grid card components
// ============================================================================

function MediaThumbnail({ image, alt }: { image: Media['image']; alt: string }) {
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

function hasDisplayableImage(image: Media['image']): boolean {
    if (image == null) return false;
    if ('key' in image && image.key) return true;
    if ('url' in image && image.url) return true;
    return false;
}

function MediaCard({ media, onClick }: { media: Media; onClick: () => void }) {
    return (
        <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg" onClick={onClick}>
            {/* Thumbnail */}
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

            {/* Info */}
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
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })}
                </span>
            </CardContent>
        </Card>
    );
}

function MediaCardSkeleton() {
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
