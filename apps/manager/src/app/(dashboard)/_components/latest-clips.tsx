'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Film, Play } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

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

type Clip = ContractOutputs['admin']['clips']['list']['clips'][number];

const chartConfig = {
    count: {
        label: 'Clips',
    },
    YOUTUBE: {
        label: 'YouTube',
        color: 'hsl(var(--chart-1))',
    },
    VIMEO: {
        label: 'Vimeo',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

const RADIAN = Math.PI / 180;

function renderInnerLabel(props: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    payload: { provider: string; count: number };
    percent: number;
}) {
    const { cx, cy, midAngle, innerRadius, outerRadius, payload, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const config = chartConfig[payload.provider as keyof typeof chartConfig];
    const label = config && 'label' in config ? config.label : payload.provider;

    return (
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
            <tspan x={x} dy="-0.5em" className="fill-background text-[11px] font-medium">
                {label}
            </tspan>
            <tspan x={x} dy="1.2em" className="fill-background text-[10px]">
                {`${(percent * 100).toFixed(0)}%`}
            </tspan>
        </text>
    );
}

export function LatestClips() {
    const { data: overview, isLoading: overviewLoading } = useQuery(orpc.admin.overview.queryOptions());
    const { data, isLoading } = useQuery(
        orpc.admin.clips.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    const chartData = React.useMemo(() => {
        if (!overview?.clipsByProvider) return [];
        return overview.clipsByProvider.map((item) => ({
            provider: item.provider,
            count: item.count,
            fill: `var(--color-${item.provider})`,
        }));
    }, [overview?.clipsByProvider]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clips</CardTitle>
                <Film className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* Total count + Pie chart */}
                <div className="flex items-center gap-4">
                    <div className="shrink-0">
                        {overviewLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{overview?.totalClips?.toLocaleString()}</div>
                        )}
                        <p className="text-xs text-muted-foreground">total clips</p>
                    </div>
                    <div className="flex-1">
                        {overviewLoading ? (
                            <Skeleton className="mx-auto aspect-square w-full max-w-37.5 rounded-full" />
                        ) : (
                            <ChartContainer config={chartConfig} className="ml-auto aspect-square w-full max-h-50">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="count"
                                        nameKey="provider"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={55}
                                        isAnimationActive={false}
                                        label={renderInnerLabel}
                                        labelLine={false}
                                    >
                                        {chartData.map((entry) => (
                                            <Cell key={entry.provider} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Latest clips list */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium text-muted-foreground">Latest clips</p>
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                        : data?.clips.map((c) => <ClipRow key={c.id} clip={c} />)}
                </div>
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
