'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Film, Image } from 'lucide-react';

import { Badge, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

export function LatestMedia() {
    const { data, isLoading } = useQuery(
        orpc.admin.media.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Latest Media</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : data?.media.map((m) => (
                          <div key={m.id} className="flex items-center gap-3 rounded-md p-2">
                              {m.image?.url ? (
                                  <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                      <img
                                          src={m.image.url}
                                          alt={m.caption || 'Media preview'}
                                          className="size-full object-cover"
                                      />
                                      {m.type === 'VIDEO' && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                              <Film className="size-4 text-white" />
                                          </div>
                                      )}
                                  </div>
                              ) : (
                                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                      {m.type === 'VIDEO' ? (
                                          <Film className="size-4 text-muted-foreground" />
                                      ) : (
                                          <Image className="size-4 text-muted-foreground" />
                                      )}
                                  </div>
                              )}
                              <div className="flex flex-1 flex-col overflow-hidden">
                                  <span className="truncate text-sm font-medium">{m.caption || 'No caption'}</span>
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
