'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Film, Play } from 'lucide-react';
import Link from 'next/link';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

type Clip = ContractOutputs['admin']['clips']['list']['clips'][number];

export function LatestClips() {
    const { data, isLoading } = useQuery(
        orpc.admin.clips.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Latest Clips</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : data?.clips.map((c) => <ClipRow key={c.id} clip={c} />)}
            </CardContent>
        </Card>
    );
}

function ClipRow({ clip }: { clip: Clip }) {
    return (
        <div className="flex items-center gap-3 rounded-md p-2">
            {clip.thumbnailURL ? (
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img src={clip.thumbnailURL} alt={clip.title} className="size-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="size-4 text-white" />
                    </div>
                </div>
            ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Film className="size-4 text-muted-foreground" />
                </div>
            )}
            <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{clip.title || 'Untitled'}</span>
                <span className="truncate text-xs text-muted-foreground">
                    {clip.spot?.name ?? 'No spot'}
                    {clip.addedBy ? (
                        <>
                            {' · '}
                            <Link href={`/users/${clip.addedBy.username}`} className="hover:underline">
                                {clip.addedBy.username}
                            </Link>
                        </>
                    ) : null}
                </span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge variant="outline" className="text-xs">
                    {clip.provider}
                </Badge>
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(clip.createdAt), { addSuffix: true })}
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
