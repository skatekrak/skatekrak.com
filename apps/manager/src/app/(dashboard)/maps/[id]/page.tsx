'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Skeleton } from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';

import { MapInfoCard } from './map-info-card';
import { MapPreviewTabs } from './map-preview-tabs';

// ============================================================================
// Page Component
// ============================================================================

export default function MapDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { data: map, isLoading } = useQuery(
        orpc.maps.fetch.queryOptions({
            input: { id },
        }),
    );

    const deleteMutation = useMutation({
        mutationFn: () => client.admin.maps.delete({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.admin.maps.list.queryOptions({ input: {} }).queryKey,
            });
            router.push('/maps');
        },
    });

    return (
        <>
            <SiteHeader title={isLoading ? 'Maps' : `Maps / ${map?.name ?? id}`} />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Skeleton className="h-96" />
                        <div className="lg:col-span-2">
                            <Skeleton className="h-96" />
                        </div>
                    </div>
                ) : map ? (
                    <>
                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/maps/${id}/edit`}>
                                    <Pencil className="mr-2 size-4" />
                                    Edit
                                </Link>
                            </Button>
                            {confirmDelete ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Are you sure?</span>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deleteMutation.mutate()}
                                        disabled={deleteMutation.isPending}
                                    >
                                        {deleteMutation.isPending ? 'Deleting...' : 'Confirm'}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(true)}>
                                    <Trash2 className="mr-2 size-4" />
                                    Delete
                                </Button>
                            )}
                        </div>

                        {deleteMutation.error && (
                            <p className="text-sm text-destructive">
                                {deleteMutation.error.message || 'Failed to delete map.'}
                            </p>
                        )}

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div>
                                <MapInfoCard map={map} />
                            </div>
                            <div className="lg:col-span-2">
                                <MapPreviewTabs map={map} />
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-muted-foreground">Map not found</p>
                )}
            </div>
        </>
    );
}
