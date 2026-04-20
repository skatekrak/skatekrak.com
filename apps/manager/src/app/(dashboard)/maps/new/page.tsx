'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { AdminMapCategorySchema } from '@krak/contracts';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Separator,
    Switch,
    Textarea,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';

import { CreateMapPreviewTabs } from './create-map-preview-tabs';
import { createMapSchema, type CreateMapValues } from './types';

// ============================================================================
// Constants
// ============================================================================

type MapCategory = z.infer<typeof AdminMapCategorySchema>;

const mapCategories = AdminMapCategorySchema.options;

const categoryLabels: Record<string, string> = {
    maps: 'Maps',
    video: 'Video',
    skater: 'Skaters',
    filmer: 'Filmers',
    photographer: 'Photographers',
    magazine: 'Magazines',
    skatepark: 'Skateparks',
    shop: 'Shops',
    years: 'Years',
    greatest: 'Greatest',
    members: 'Members',
    artist: 'Artists',
};

// ============================================================================
// Page Component
// ============================================================================

export default function CreateMapPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<CreateMapValues>({
        resolver: zodResolver(createMapSchema),
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

    const videosField = useFieldArray({ control: form.control, name: 'videos' });
    const soundtrackField = useFieldArray({ control: form.control, name: 'soundtrack' });

    const watchedCategories = useWatch({ control: form.control, name: 'categories' });

    const mutation = useMutation({
        mutationFn: (values: CreateMapValues) => {
            return client.admin.maps.create({
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

    function toggleCategory(cat: MapCategory) {
        const current = form.getValues('categories');
        if (current.includes(cat)) {
            form.setValue(
                'categories',
                current.filter((c) => c !== cat),
                { shouldValidate: true },
            );
        } else {
            form.setValue('categories', [...current, cat], { shouldValidate: true });
        }
    }

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
                                        <FormField
                                            control={form.control}
                                            name="id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ID (slug)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="my-map" {...field} />
                                                    </FormControl>
                                                    <p className="text-xs text-muted-foreground">
                                                        URL-safe identifier (lowercase, numbers, hyphens)
                                                    </p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Map name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subtitle</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Optional subtitle" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Categories as toggleable badges */}
                                        <FormField
                                            control={form.control}
                                            name="categories"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel>Categories</FormLabel>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {mapCategories.map((cat) => (
                                                            <Badge
                                                                key={cat}
                                                                variant={
                                                                    watchedCategories.includes(cat)
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                className="cursor-pointer"
                                                                onClick={() => toggleCategory(cat)}
                                                            >
                                                                {categoryLabels[cat] ?? cat}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="edito"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Edito</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Editorial content..."
                                                            rows={3}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="about"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>About</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="About this map..." rows={3} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="staging"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center gap-3">
                                                    <FormLabel>Staging</FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        {/* Videos dynamic list */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Videos</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => videosField.append({ value: '' })}
                                                >
                                                    <Plus className="mr-1 size-4" />
                                                    Add
                                                </Button>
                                            </div>
                                            {videosField.fields.map((arrayField, index) => (
                                                <div key={arrayField.id} className="flex items-center gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`videos.${index}.value`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input placeholder="https://..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => videosField.remove(index)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Soundtrack dynamic list */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Soundtrack</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => soundtrackField.append({ value: '' })}
                                                >
                                                    <Plus className="mr-1 size-4" />
                                                    Add
                                                </Button>
                                            </div>
                                            {soundtrackField.fields.map((arrayField, index) => (
                                                <div key={arrayField.id} className="flex items-center gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`soundtrack.${index}.value`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input placeholder="Track name" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => soundtrackField.remove(index)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

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
