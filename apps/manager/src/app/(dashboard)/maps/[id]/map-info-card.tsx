'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { ContractOutputs } from '@krak/contracts';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Form,
    KrakImage,
    Separator,
    useImgproxy,
} from '@krak/ui';
import { getImgproxyUrl } from '@krak/utils';

import { client, orpc } from '@/lib/orpc';

import { MapFormFields } from '../_components/map-form-fields';
import { categoryLabels, mapFormSchema, normalizeCategoryKeys, type MapFormValues } from '../_components/map-form-types';

type MapData = ContractOutputs['maps']['fetch'];

interface MapInfoCardProps {
    map: MapData;
}

export function MapInfoCard({ map }: MapInfoCardProps) {
    const [editing, setEditing] = useState(false);

    return editing ? (
        <MapEditCard map={map} onCancel={() => setEditing(false)} onSaved={() => setEditing(false)} />
    ) : (
        <MapReadCard map={map} onEdit={() => setEditing(true)} />
    );
}

// ============================================================================
// Read mode
// ============================================================================

function MapReadCard({ map, onEdit }: { map: MapData; onEdit: () => void }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: () => client.admin.maps.delete({ id: map.id }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.admin.maps.list.queryOptions({ input: {} }).queryKey,
            });
            router.push('/maps');
        },
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <CardTitle>{map.name}</CardTitle>
                            {map.staging && (
                                <Badge variant="outline" className="text-xs">
                                    Staging
                                </Badge>
                            )}
                        </div>
                        {map.subtitle && <p className="text-sm text-muted-foreground">{map.subtitle}</p>}
                    </div>
                    <KrakImage
                        path={`assets/maps/custom-maps/${map.id}.png`}
                        alt={map.name}
                        options={{ width: 80, height: 80, resizingType: 'fit', format: 'webp' }}
                        className="size-10 shrink-0 rounded-md object-contain"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* Categories */}
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Categories</span>
                    <div className="flex flex-wrap gap-1">
                        {map.categories.map((cat) => (
                            <Badge key={cat} variant="secondary">
                                {categoryLabels[cat] ?? cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Edito */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Edito</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{map.edito || '\u2014'}</p>
                </div>

                {/* About */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">About</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{map.about || '\u2014'}</p>
                </div>

                <Separator />

                {/* Videos */}
                {map.videos.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Videos ({map.videos.length})</span>
                        <ul className="flex flex-col gap-1">
                            {map.videos.map((url, i) => (
                                <li key={i}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all text-sm text-primary underline-offset-4 hover:underline"
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Soundtrack */}
                {map.soundtrack.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Soundtrack ({map.soundtrack.length})</span>
                        <ul className="flex flex-col gap-1">
                            {map.soundtrack.map((track, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                    {track}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {(map.videos.length > 0 || map.soundtrack.length > 0) && <Separator />}

                {/* ID */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ID</span>
                    <span className="font-mono text-sm text-muted-foreground">{map.id}</span>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onEdit}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                    </Button>
                    {confirmDelete ? (
                        <>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteMutation.mutate()}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Confirm delete'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
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
            </CardContent>
        </Card>
    );
}

// ============================================================================
// Edit mode
// ============================================================================

function MapEditCard({ map, onCancel, onSaved }: { map: MapData; onCancel: () => void; onSaved: () => void }) {
    const queryClient = useQueryClient();
    const imgproxy = useImgproxy();
    const imageFileRef = useRef<File | null>(null);

    const form = useForm<MapFormValues>({
        resolver: zodResolver(mapFormSchema),
        defaultValues: {
            id: map.id,
            name: map.name,
            subtitle: map.subtitle ?? '',
            categories: normalizeCategoryKeys(map.categories),
            edito: map.edito ?? '',
            about: map.about ?? '',
            staging: map.staging,
            videos: map.videos.map((v) => ({ value: v })),
            soundtrack: map.soundtrack.map((s) => ({ value: s })),
        },
    });

    // Re-sync if map data changes while editing
    useEffect(() => {
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
                queryKey: orpc.maps.fetch.queryOptions({ input: { id: map.id } }).queryKey,
            });
            queryClient.invalidateQueries({
                queryKey: orpc.admin.maps.list.queryOptions({ input: {} }).queryKey,
            });
            onSaved();
        },
    });

    const existingImageUrl = imgproxy
        ? getImgproxyUrl(imgproxy.baseUrl, `assets/maps/custom-maps/${map.id}.png`, {
              width: 400,
              resizingType: 'fit',
              format: 'webp',
          })
        : undefined;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Edit Map</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="size-4" />
                    </Button>
                </div>
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

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
