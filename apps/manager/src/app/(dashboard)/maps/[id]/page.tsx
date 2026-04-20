'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useImgproxy } from '@krak/ui';
import { Button, Card, CardContent, CardHeader, CardTitle, Form, Separator, Skeleton } from '@krak/ui';
import { getImgproxyUrl } from '@krak/utils';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';

import { MapFormFields } from '../_components/map-form-fields';
import { mapFormSchema, normalizeCategoryKeys, type MapFormValues } from '../_components/map-form-types';
import { MapPreviewTabs } from './map-preview-tabs';

// ============================================================================
// Page Component
// ============================================================================

export default function MapEditPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const imgproxy = useImgproxy();
    const imageFileRef = useRef<File | null>(null);

    const { data: map, isLoading } = useQuery(
        orpc.maps.fetch.queryOptions({
            input: { id },
        }),
    );

    const form = useForm<MapFormValues>({
        resolver: zodResolver(mapFormSchema),
        defaultValues: {
            id: '',
            name: '',
            subtitle: '',
            categories: [],
            edito: '',
            about: '',
            staging: false,
            videos: [],
            soundtrack: [],
        },
    });

    // Populate form when map data loads
    useEffect(() => {
        if (!map) return;
        form.reset({
            id: map.id,
            name: map.name,
            subtitle: map.subtitle ?? '',
            categories: normalizeCategoryKeys(map.categories),
            edito: map.edito ?? '',
            about: map.about ?? '',
            staging: map.staging,
            videos: map.videos.map((v) => ({ value: v })),
            soundtrack: map.soundtrack.map((s) => ({ value: s })),
        });
    }, [map, form]);

    const mutation = useMutation({
        mutationFn: async (values: MapFormValues) => {
            const updated = await client.admin.maps.update({
                id: values.id,
                name: values.name,
                subtitle: values.subtitle,
                categories: values.categories,
                edito: values.edito,
                about: values.about,
                staging: values.staging,
                videos: values.videos.map((v) => v.value).filter(Boolean),
                soundtrack: values.soundtrack.map((s) => s.value).filter(Boolean),
            });

            if (imageFileRef.current) {
                await client.admin.maps.uploadImage({ id: values.id, file: imageFileRef.current });
            }

            return updated;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.maps.fetch.queryOptions({ input: { id } }).queryKey,
            });
            queryClient.invalidateQueries({
                queryKey: orpc.admin.maps.list.queryOptions({ input: {} }).queryKey,
            });
        },
    });

    const existingImageUrl = imgproxy
        ? getImgproxyUrl(imgproxy.baseUrl, `assets/maps/custom-maps/${id}.png`, {
              width: 400,
              resizingType: 'fit',
              format: 'webp',
          })
        : undefined;

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
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Form */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Edit Map</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                                            className="flex flex-col gap-4"
                                        >
                                            <MapFormFields
                                                form={form}
                                                idReadOnly
                                                existingImageUrl={existingImageUrl}
                                                onImageChange={(file) => {
                                                    imageFileRef.current = file;
                                                }}
                                            />

                                            <Separator />

                                            {mutation.error && (
                                                <p className="text-sm text-destructive">
                                                    {mutation.error.message || 'Failed to update map.'}
                                                </p>
                                            )}

                                            {mutation.isSuccess && (
                                                <p className="text-sm text-green-600">Map updated successfully.</p>
                                            )}

                                            <div className="flex items-center gap-3">
                                                <Button type="submit" disabled={mutation.isPending}>
                                                    {mutation.isPending ? 'Saving...' : 'Save'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => router.push('/maps')}
                                                >
                                                    Back
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview */}
                        <div className="lg:col-span-2">
                            <MapPreviewTabs map={map} />
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Map not found</p>
                )}
            </div>
        </>
    );
}
