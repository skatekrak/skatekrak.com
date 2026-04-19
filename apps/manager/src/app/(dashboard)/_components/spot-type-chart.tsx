'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Pie, PieChart } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

import type { ContractOutputs } from '@krak/contracts';
import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    ChartContainer,
    Separator,
    Skeleton,
    type ChartConfig,
} from '@krak/ui';

import { orpc } from '@/lib/orpc';

type Spot = ContractOutputs['admin']['spots']['list']['spots'][number];

const RADIAN = Math.PI / 180;

const chartConfig = {
    count: {
        label: 'Spots',
    },
    STREET: {
        label: 'Street',
        color: 'hsl(var(--chart-1))',
    },
    PARK: {
        label: 'Park',
        color: 'hsl(var(--chart-2))',
    },
    SHOP: {
        label: 'Shop',
        color: 'hsl(var(--chart-3))',
    },
    DIY: {
        label: 'DIY',
        color: 'hsl(var(--chart-4))',
    },
    PRIVATE: {
        label: 'Private',
        color: 'hsl(var(--chart-5))',
    },
} satisfies ChartConfig;

function renderOuterLabel(props: PieLabelRenderProps) {
    const { cx, cy, midAngle, outerRadius, payload } = props as PieLabelRenderProps & {
        payload: { type: string; count: number };
    };

    if (cx == null || cy == null || midAngle == null || outerRadius == null) return null;

    const radius = Number(outerRadius) + 16;
    const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
    const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
    const anchor = midAngle > 90 && midAngle < 270 ? 'end' : 'start';

    const config = chartConfig[payload.type as keyof typeof chartConfig];
    const label = config && 'label' in config ? config.label : payload.type;

    return (
        <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" className="text-[11px]">
            <tspan className="fill-foreground font-medium">{label}</tspan>
            <tspan className="fill-muted-foreground">{` ${payload.count.toLocaleString()}`}</tspan>
        </text>
    );
}

export function SpotTypeChart() {
    const { data: overview, isLoading: overviewLoading } = useQuery(orpc.admin.overview.queryOptions());
    const { data: spotsData, isLoading: spotsLoading } = useQuery(
        orpc.admin.spots.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    const chartData = React.useMemo(() => {
        if (!overview?.spotsByType) return [];
        return overview.spotsByType.map((item) => ({
            type: item.type,
            count: item.count,
            fill: `var(--color-${item.type})`,
        }));
    }, [overview?.spotsByType]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Spots</CardTitle>
                <MapPin className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* Total count + Pie chart */}
                <div className="flex items-center gap-4">
                    <div className="shrink-0">
                        {overviewLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{overview?.totalSpots?.toLocaleString()}</div>
                        )}
                        <p className="text-xs text-muted-foreground">total spots</p>
                    </div>
                    <div className="flex-1">
                        {overviewLoading ? (
                            <Skeleton className="mx-auto aspect-square w-full max-w-[150px] rounded-full" />
                        ) : (
                            <ChartContainer config={chartConfig} className="ml-auto aspect-square w-full max-h-[200px]">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="count"
                                        nameKey="type"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={55}
                                        isAnimationActive={false}
                                        label={renderOuterLabel}
                                        labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                                    />
                                </PieChart>
                            </ChartContainer>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Latest spots list */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium text-muted-foreground">Latest spots</p>
                    {spotsLoading
                        ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                        : spotsData?.spots.map((spot) => <SpotRow key={spot.id} spot={spot} />)}
                </div>
            </CardContent>
        </Card>
    );
}

function SpotRow({ spot }: { spot: Spot }) {
    return (
        <Link href={`/spots/${spot.id}/info`} className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50">
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
        </Link>
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
