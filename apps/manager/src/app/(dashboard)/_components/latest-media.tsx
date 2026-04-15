'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Film, Image } from 'lucide-react';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

type Media = ContractOutputs['admin']['media']['list']['media'][number];

export function LatestMedia() {
    const { data, isLoading } = useQuery(
        orpc.admin.media.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Latest Media</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : data?.media.map((m) => <MediaRow key={m.id} media={m} />)}
            </CardContent>
        </Card>
    );
}

function MediaRow({ media }: { media: Media }) {
    return (
        <div className="flex items-center gap-3 rounded-md p-2">
            {media.image?.url ? (
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                        src={media.image.url}
                        alt={media.caption || 'Media preview'}
                        className="size-full object-cover"
                    />
                    {media.type === 'VIDEO' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Film className="size-4 text-white" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    {media.type === 'VIDEO' ? (
                        <Film className="size-4 text-muted-foreground" />
                    ) : (
                        <Image className="size-4 text-muted-foreground" />
                    )}
                </div>
            )}
            <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{media.caption || 'No caption'}</span>
                <span className="truncate text-xs text-muted-foreground">
                    {media.spot?.name ?? 'No spot'}
                    {media.addedBy ? ` · ${media.addedBy.username}` : ''}
                </span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge variant="outline" className="text-xs">
                    {media.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })}
                </span>
            </div>
        </div>
    );
}

function RowSkeleton() {
    return (
        <div className="flex items-center gap-3 p-2">
            <Skeleton className="size-10 rounded-md" />
            <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}
