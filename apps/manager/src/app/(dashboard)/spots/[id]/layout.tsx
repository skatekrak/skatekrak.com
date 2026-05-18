'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { use } from 'react';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

import { SpotActions } from './_components/spot-actions';
import { SpotHero } from './_components/spot-hero';
import { SpotHeroSkeleton } from './_components/spot-hero-skeleton';
import { SpotTabs } from './_components/spot-tabs';

export default function SpotDetailLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const pathname = usePathname();

    const { data, isLoading } = useQuery(
        orpc.spots.getSpotOverview.queryOptions({
            input: { id },
        }),
    );

    const title = isLoading ? 'Spot' : data ? `Spot - ${data.spot.name}` : 'Spot Not Found';

    return (
        <>
            <SiteHeader title={title} rightActions={data ? <SpotActions spot={data.spot} /> : null} />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {isLoading ? <SpotHeroSkeleton /> : data ? <SpotHero spot={data.spot} /> : null}
                <SpotTabs id={id} pathname={pathname} />
                {children}
            </div>
        </>
    );
}
