'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Film, Image } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Cell, Pie, PieChart, type PieLabelRenderProps } from 'recharts';

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

type Media = ContractOutputs['admin']['media']['list']['media'][number];

const chartConfig = {
    count: {
        label: 'Media',
    },
    IMAGE: {
        label: 'Images',
        color: 'hsl(var(--chart-1))',
    },
    VIDEO: {
        label: 'Videos',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

const RADIAN = Math.PI / 180;

function renderInnerLabel(props: PieLabelRenderProps) {
    const cx = Number(props.cx ?? 0);
    const cy = Number(props.cy ?? 0);
    const midAngle = props.midAngle ?? 0;
    const innerRadius = Number(props.innerRadius ?? 0);
    const outerRadius = Number(props.outerRadius ?? 0);
    const percent = props.percent ?? 0;
    const payload = props.payload as { type: string; count: number };
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const config = chartConfig[payload.type as keyof typeof chartConfig];
    const label = config && 'label' in config ? config.label : payload.type;

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

export function LatestMedia() {
    const { data: overview, isLoading: overviewLoading } = useQuery(orpc.admin.overview.queryOptions());
    const { data, isLoading } = useQuery(
        orpc.admin.media.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    const chartData = React.useMemo(() => {
        if (!overview?.mediaByType) return [];
        return overview.mediaByType.map((item) => ({
            type: item.type,
            count: item.count,
            fill: `var(--color-${item.type})`,
        }));
    }, [overview?.mediaByType]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Media</CardTitle>
                <Image className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* Total count + Pie chart */}
                <div className="flex items-center gap-4">
                    <div className="shrink-0">
                        {overviewLoading ? (
                            <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{overview?.totalMedia?.toLocaleString()}</div>
                        )}
                        <p className="text-xs text-muted-foreground">total media</p>
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
                                        label={renderInnerLabel}
                                        labelLine={false}
                                    >
                                        {chartData.map((entry) => (
                                            <Cell key={entry.type} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Latest media list */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium text-muted-foreground">Latest media</p>
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                        : data?.media.map((m) => <MediaRow key={m.id} media={m} />)}
                </div>
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
                    {media.addedBy ? (
                        <>
                            {' · '}
                            <Link href={`/users/${media.addedBy.username}`} className="hover:underline">
                                {media.addedBy.username}
                            </Link>
                        </>
                    ) : null}
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
