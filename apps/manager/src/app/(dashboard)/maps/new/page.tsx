'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Card, CardContent, CardHeader, CardTitle, Form, Separator } from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';

import { MapFormFields } from '../_components/map-form-fields';
import { mapFormSchema, type MapFormValues } from '../_components/map-form-types';
import { CreateMapPreviewTabs } from './create-map-preview-tabs';

// ============================================================================
// Page Component
// ============================================================================

export default function CreateMapPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const imageFileRef = useRef<File | null>(null);

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

    const mutation = useMutation({
        mutationFn: async (values: MapFormValues) => {
            const map = await client.admin.maps.create({
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

            return map;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: orpc.admin.maps.list.queryOptions({ input: {} }).queryKey,
            });
            router.push(`/maps/${data.id}`);
        },
        onError: (error) => {
            if (error.message?.includes('already exists')) {
                form.setError('id', { message: 'A map with this ID already exists' });
            }
        },
    });

    return (
        <>
            <SiteHeader title="Create Map" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>New Map</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                                        className="flex flex-col gap-4"
                                    >
                                        <MapFormFields
                                            form={form}
                                            onImageChange={(file) => {
                                                imageFileRef.current = file;
                                            }}
                                        />

                                        <Separator />

                                        {mutation.error && !mutation.error.message?.includes('already exists') && (
                                            <p className="text-sm text-destructive">
                                                {mutation.error.message || 'Failed to create map.'}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <Button type="submit" disabled={mutation.isPending}>
                                                {mutation.isPending ? 'Creating...' : 'Create Map'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.push('/maps')}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-2">
                        <CreateMapPreviewTabs control={form.control} />
                    </div>
                </div>
            </div>
        </>
    );
}
