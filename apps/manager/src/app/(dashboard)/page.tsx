'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Film, Image, MapPin, Users } from 'lucide-react';

import {
    Avatar,
    AvatarFallback,
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Skeleton,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

export default function DashboardPage() {
    const { data: overview, isLoading: overviewLoading } = useQuery(orpc.admin.overview.queryOptions());

    const { data: usersData, isLoading: usersLoading } = useQuery(
        orpc.admin.users.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    const { data: spotsData, isLoading: spotsLoading } = useQuery(
        orpc.admin.spots.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    const { data: mediaData, isLoading: mediaLoading } = useQuery(
        orpc.admin.media.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    return (
        <>
            <SiteHeader title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard title="Users" value={overview?.totalUsers} loading={overviewLoading} icon={Users} />
                    <StatCard title="Spots" value={overview?.totalSpots} loading={overviewLoading} icon={MapPin} />
                    <StatCard title="Media" value={overview?.totalMedia} loading={overviewLoading} icon={Image} />
                    <StatCard title="Clips" value={overview?.totalClips} loading={overviewLoading} icon={Film} />
                </div>

                {/* Latest sections */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Latest Users */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Latest Users</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {usersLoading
                                ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                                : usersData?.users.map((user) => (
                                      <a
                                          key={user.id}
                                          href={`/users/${user.username}`}
                                          className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted"
                                      >
                                          <Avatar className="size-8">
                                              <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                                          </Avatar>
                                          <div className="flex flex-1 flex-col overflow-hidden">
                                              <span className="truncate text-sm font-medium">{user.username}</span>
                                              <span className="truncate text-xs text-muted-foreground">
                                                  {user.email}
                                              </span>
                                          </div>
                                          <span className="shrink-0 text-xs text-muted-foreground">
                                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                          </span>
                                      </a>
                                  ))}
                        </CardContent>
                    </Card>

                    {/* Latest Spots */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Latest Spots</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {spotsLoading
                                ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                                : spotsData?.spots.map((spot) => (
                                      <div key={spot.id} className="flex items-center gap-3 rounded-md p-2">
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
                                  ))}
                        </CardContent>
                    </Card>

                    {/* Latest Media */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Latest Media</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {mediaLoading
                                ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                                : mediaData?.media.map((m) => (
                                      <div key={m.id} className="flex items-center gap-3 rounded-md p-2">
                                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                              {m.type === 'VIDEO' ? (
                                                  <Film className="size-4 text-muted-foreground" />
                                              ) : (
                                                  <Image className="size-4 text-muted-foreground" />
                                              )}
                                          </div>
                                          <div className="flex flex-1 flex-col overflow-hidden">
                                              <span className="truncate text-sm font-medium">
                                                  {m.caption || 'No caption'}
                                              </span>
                                              <span className="truncate text-xs text-muted-foreground">
                                                  {m.spot?.name ?? 'No spot'}
                                                  {m.addedBy ? ` · ${m.addedBy.username}` : ''}
                                              </span>
                                          </div>
                                          <div className="flex shrink-0 flex-col items-end gap-1">
                                              <Badge variant="outline" className="text-xs">
                                                  {m.type}
                                              </Badge>
                                              <span className="text-xs text-muted-foreground">
                                                  {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                                              </span>
                                          </div>
                                      </div>
                                  ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

// ============================================================================
// Stat card component
// ============================================================================

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

// ============================================================================
// Row skeleton for latest sections
// ============================================================================

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
