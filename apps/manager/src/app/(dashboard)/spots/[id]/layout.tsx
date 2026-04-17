'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use } from 'react';

import { cn, Skeleton } from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

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

    const tabs = [
        { label: 'Info', href: `/spots/${id}/info` },
        { label: 'Media', href: `/spots/${id}/media` },
    ];

    const title = isLoading ? 'Spot' : data ? `Spot - ${data.spot.name}` : 'Spot Not Found';

    return (
        <>
            <SiteHeader title={title} />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all',
                                pathname.startsWith(tab.href)
                                    ? 'bg-background text-foreground shadow'
                                    : 'hover:text-foreground/80',
                            )}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
                {children}
            </div>
        </>
    );
}
