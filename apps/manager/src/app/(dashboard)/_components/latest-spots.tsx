'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { MapPin } from 'lucide-react';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

type Spot = ContractOutputs['admin']['spots']['list']['spots'][number];

export function LatestSpots() {
    const { data, isLoading } = useQuery(
        orpc.admin.spots.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Latest Spots</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : data?.spots.map((spot) => <SpotRow key={spot.id} spot={spot} />)}
            </CardContent>
        </Card>
    );
}

function SpotRow({ spot }: { spot: Spot }) {
    return (
        <div className="flex items-center gap-3 rounded-md p-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <MapPin className="size-4 text-muted-foreground" />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{spot.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                    {[spot.city, spot.country].filter(Boolean).join(', ')}
                </span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge variant="outline" className="text-xs">
                    {spot.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(spot.createdAt), { addSuffix: true })}
                </span>
            </div>
        </div>
    );
}

function RowSkeleton() {
    return (
        <div className="flex items-center gap-3 p-2">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}
