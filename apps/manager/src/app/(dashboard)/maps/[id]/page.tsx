'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { Skeleton } from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

import { MapInfoCard } from './map-info-card';
import { MapPreviewTabs } from './map-preview-tabs';

export default function MapDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: map, isLoading } = useQuery(
        orpc.maps.fetch.queryOptions({
            input: { id },
        }),
    );

    return (
        <>
            <SiteHeader title={isLoading ? 'Maps' : `Maps / ${map?.name ?? id}`} />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Skeleton className="h-96" />
                        <div className="lg:col-span-2">
                            <Skeleton className="h-96" />
                        </div>
                    </div>
                ) : map ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div>
                            <MapInfoCard map={map} />
                        </div>
                        <div className="lg:col-span-2">
                            <MapPreviewTabs map={map} />
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Map not found</p>
                )}
            </div>
        </>
    );
}
