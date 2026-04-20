'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Pencil, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use, useRef, useState } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Button, cn, Input, Skeleton } from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';

type SpotOverview = ContractOutputs['spots']['getSpotOverview'];
type Spot = SpotOverview['spot'];

// ============================================================================
// Hero section (spot name + location + type/status + stats)
// ============================================================================

function StatCell({ label, value }: { label: string; value: number | null | undefined }) {
    return (
        <div className="flex w-20 flex-col items-center gap-1 rounded-md border p-3">
            <span className="text-2xl font-semibold">{value ?? 0}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    );
}

function TypeBadge({ type }: { type: string }) {
    const variant = type === 'street' ? 'default' : type === 'park' || type === 'diy' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{type}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
    const variant = status === 'rip' ? 'destructive' : status === 'wip' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{status}</Badge>;
}

function SpotHero({ spot }: { spot: Spot }) {
    const location = [spot.location.city, spot.location.country].filter(Boolean).join(', ');
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(spot.name);
    const inputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: (newName: string) => client.admin.spots.updateGeneralInfo({ id: spot.id, name: newName }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.spots.getSpotOverview.queryOptions({ input: { id: spot.id } }).queryKey,
            });
            setIsEditing(false);
        },
    });

    const handleEdit = () => {
        setName(spot.name);
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleCancel = () => {
        setName(spot.name);
        mutation.reset();
        setIsEditing(false);
    };

    const handleSave = () => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === spot.name) {
            handleCancel();
            return;
        }
        mutation.mutate(trimmed);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
    };

    return (
        <div className="flex items-center gap-6 py-4">
            <div className="flex shrink-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Input
                                ref={inputRef}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-9 w-64 text-2xl font-semibold"
                                disabled={mutation.isPending}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleSave}
                                disabled={mutation.isPending}
                            >
                                <Check className="size-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleCancel}
                                disabled={mutation.isPending}
                            >
                                <X className="size-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-semibold">{spot.name}</h1>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
                                <Pencil className="size-4" />
                            </Button>
                        </>
                    )}
                </div>
                {mutation.error && (
                    <p className="text-sm text-destructive">{mutation.error.message || 'Failed to update name.'}</p>
                )}
                {location && <p className="text-sm text-muted-foreground">{location}</p>}
                <div className="mt-1 flex gap-2">
                    <TypeBadge type={spot.type} />
                    <StatusBadge status={spot.status} />
                    {spot.indoor && <Badge variant="outline">indoor</Badge>}
                </div>
            </div>
            <div className="ml-auto flex gap-2">
                <StatCell label="Media" value={spot.mediasStat?.all} />
                <StatCell label="Clips" value={spot.clipsStat?.all} />
                <StatCell label="Tricks" value={spot.tricksDoneStat?.all} />
                <StatCell label="Comments" value={spot.commentsStat?.all} />
            </div>
        </div>
    );
}

function SpotHeroSkeleton() {
    return (
        <div className="flex items-center gap-6 py-4">
            <div className="flex shrink-0 flex-col gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="mt-1 flex gap-2">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            </div>
            <div className="ml-auto flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-20 rounded-md" />
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Layout
// ============================================================================

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
                {isLoading ? <SpotHeroSkeleton /> : data ? <SpotHero spot={data.spot} /> : null}
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
