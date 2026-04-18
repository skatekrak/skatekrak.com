'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Label, Pie, PieChart } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    Skeleton,
    type ChartConfig,
} from '@krak/ui';

import { orpc } from '@/lib/orpc';

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

export function SpotTypeChart() {
    const { data: overview, isLoading } = useQuery(orpc.admin.overview.queryOptions());

    const chartData = React.useMemo(() => {
        if (!overview?.spotsByType) return [];
        return overview.spotsByType.map((item) => ({
            type: item.type,
            count: item.count,
            fill: `var(--color-${item.type})`,
        }));
    }, [overview?.spotsByType]);

    const totalSpots = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0);
    }, [chartData]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="items-center pb-0">
                    <CardTitle>Spots by Type</CardTitle>
                    <CardDescription>Distribution of spot types</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center pb-0">
                    <Skeleton className="mx-auto aspect-square size-[250px] rounded-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle>Spots by Type</CardTitle>
                <CardDescription>Distribution of spot types</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalSpots.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Spots
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="type" />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
