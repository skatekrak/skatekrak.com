'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

import { Avatar, AvatarFallback, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

export function LatestUsers() {
    const { data, isLoading } = useQuery(
        orpc.admin.users.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Latest Users</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : data?.users.map((user) => (
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
                                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                              </div>
                              <span className="shrink-0 text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                              </span>
                          </a>
                      ))}
            </CardContent>
        </Card>
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
