'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Users } from 'lucide-react';

import type { ContractOutputs } from '@krak/contracts';
import { Avatar, AvatarFallback, Card, CardContent, CardHeader, CardTitle, Separator, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

type User = ContractOutputs['admin']['users']['list']['users'][number];

export function LatestUsers() {
    const { data: overview, isLoading: overviewLoading } = useQuery(orpc.admin.overview.queryOptions());
    const { data, isLoading } = useQuery(
        orpc.admin.users.list.queryOptions({
            input: { page: 1, perPage: 8, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div>
                    {overviewLoading ? (
                        <Skeleton className="h-8 w-20" />
                    ) : (
                        <div className="text-2xl font-bold">{overview?.totalUsers?.toLocaleString()}</div>
                    )}
                    <p className="text-xs text-muted-foreground">total users</p>
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium text-muted-foreground">Latest users</p>
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                        : data?.users.map((user) => <UserRow key={user.id} user={user} />)}
                </div>
            </CardContent>
        </Card>
    );
}

function UserRow({ user }: { user: User }) {
    return (
        <a
            href={`/users/${user.username}`}
            className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted"
        >
            <Avatar className="size-8">
                <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{user.username}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
            </span>
        </a>
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
