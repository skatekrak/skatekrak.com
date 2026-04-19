'use client';

import { useQuery } from '@tanstack/react-query';
import { Film, Image, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

export function StatsRow() {
  const { data: overview, isLoading } = useQuery(orpc.admin.overview.queryOptions());

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard title="Users" value={overview?.totalUsers} loading={isLoading} icon={Users} />
      <StatCard title="Media" value={overview?.totalMedia} loading={isLoading} icon={Image} />
      <StatCard title="Clips" value={overview?.totalClips} loading={isLoading} icon={Film} />
    </div>
  );
}

function StatCard({
  title,
  value,
  loading,
  icon: Icon,
}: {
  title: string;
  value: number | undefined;
  loading: boolean;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value?.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}
