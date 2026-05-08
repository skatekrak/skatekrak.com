'use client';

import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Film, Image, Plus } from 'lucide-react';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import {
    Badge,
    Button,
    Card,
    CardContent,
    DataTablePagination,
    KrakImage,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Skeleton,
    Tabs,
    TabsList,
    TabsTrigger,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

import { AddMediaDialog } from './add-media-dialog';
import { MediaDetailDialog } from './media-detail-dialog';

type Media = ContractOutputs['admin']['media']['list']['media'][number];

const mediaTypes = ['IMAGE', 'VIDEO'] as const;
const releaseStatuses = ['released', 'planned'] as const;

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
    const [releaseStatus, setReleaseStatus] = useQueryState(
        'status',
        parseAsStringLiteral(releaseStatuses).withDefault('released'),
    );
    const [selectedMediaId, setSelectedMediaId] = useQueryState('media', parseAsString);
    const [showAddDialog, setShowAddDialog] = useState(false);

    const perPage = 24;

    const { data, isLoading } = useQuery(
        orpc.admin.media.list.queryOptions({
            input: {
                page,
                perPage,
                sortBy: 'createdAt',
                sortOrder: 'desc',
                type: type ?? undefined,
                releaseStatus,
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

    function handleTabChange(value: string) {
        setReleaseStatus(value as (typeof releaseStatuses)[number]);
        setPage(1);
    }

    return (
        <>
            <SiteHeader title="Media" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {/* Tabs + Filters */}
                <div className="flex items-center gap-4">
                    <Tabs value={releaseStatus} onValueChange={handleTabChange}>
                        <TabsList>
                            <TabsTrigger value="released">Media</TabsTrigger>
                            <TabsTrigger value="planned">Planned</TabsTrigger>
                        </TabsList>
                    </Tabs>
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
                    <div className="ml-auto">
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="size-4" />
                            Add media
                        </Button>
                    </div>
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

            {/* Add media modal */}
            <AddMediaDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
        </>
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
