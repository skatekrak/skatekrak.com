'use client';

import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Plus } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';
import { z } from 'zod';

import { createCityInput, type City } from '@krak/contracts';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Textarea,
    cn,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';

import { SortableFieldList } from '../maps/_components/sortable-field-list';

const cityFormSchema = createCityInput.omit({ videos: true }).extend({
    videos: z.array(z.object({ value: z.string() })),
});

type CityFormValues = z.infer<typeof cityFormSchema>;

const emptyCity: CityFormValues = {
    id: '',
    name: '',
    smallName: null,
    subtitle: '',
    edito: '',
    about: '',
    bounds: [
        [0, 0],
        [0, 0],
    ],
    videos: [],
    position: 0,
    hidden: false,
};

type Bounds = CityFormValues['bounds'];

function CityBoundsMap({ bounds, onChange }: { bounds: Bounds; onChange: (bounds: Bounds) => void }) {
    const [[longitude1, latitude1], [longitude2, latitude2]] = bounds;
    const empty = longitude1 === longitude2 && latitude1 === latitude2;
    const corners: [number, number][] = [
        [longitude1, latitude1],
        [longitude2, latitude1],
        [longitude2, latitude2],
        [longitude1, latitude2],
    ];
    const zone = {
        type: 'Feature' as const,
        properties: {},
        geometry: { type: 'Polygon' as const, coordinates: [[...corners, corners[0]]] },
    };

    function moveCorner(index: number, longitude: number, latitude: number) {
        if (index === 0) onChange([[longitude, latitude], bounds[1]]);
        if (index === 1)
            onChange([
                [longitude1, latitude],
                [longitude, latitude2],
            ]);
        if (index === 2) onChange([bounds[0], [longitude, latitude]]);
        if (index === 3)
            onChange([
                [longitude, latitude1],
                [longitude2, latitude],
            ]);
    }

    return (
        <div className="h-[32rem] overflow-hidden rounded-lg border">
            <Map
                initialViewState={
                    empty
                        ? { longitude: 0, latitude: 20, zoom: 1.5 }
                        : {
                              bounds: [
                                  [Math.min(longitude1, longitude2), Math.min(latitude1, latitude2)],
                                  [Math.max(longitude1, longitude2), Math.max(latitude1, latitude2)],
                              ],
                              fitBoundsOptions: { padding: 48 },
                          }
                }
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                onClick={(event) => {
                    const latitudeRadius = Math.abs(latitude2 - latitude1) / 2 || 0.05;
                    const longitudeRadius =
                        Math.abs(longitude2 - longitude1) / 2 ||
                        latitudeRadius / Math.max(Math.cos((event.lngLat.lat * Math.PI) / 180), 0.2);
                    onChange([
                        [event.lngLat.lng - longitudeRadius, event.lngLat.lat - latitudeRadius],
                        [event.lngLat.lng + longitudeRadius, event.lngLat.lat + latitudeRadius],
                    ]);
                }}
            >
                <NavigationControl position="top-right" showCompass={false} />
                {!empty && (
                    <Source id="city-zone" type="geojson" data={zone}>
                        <Layer
                            id="city-zone-fill"
                            type="fill"
                            paint={{ 'fill-color': '#2563eb', 'fill-opacity': 0.2 }}
                        />
                        <Layer
                            id="city-zone-outline"
                            type="line"
                            paint={{ 'line-color': '#1d4ed8', 'line-width': 2 }}
                        />
                    </Source>
                )}
                {!empty &&
                    corners.map(([longitude, latitude], index) => (
                        <Marker
                            key={index}
                            longitude={longitude}
                            latitude={latitude}
                            draggable
                            onDragEnd={(event) => moveCorner(index, event.lngLat.lng, event.lngLat.lat)}
                        >
                            <div
                                className="size-4 cursor-move rounded-sm border-2 border-white bg-blue-600 shadow"
                                aria-label={`Drag zone corner ${index + 1}`}
                            />
                        </Marker>
                    ))}
            </Map>
        </div>
    );
}

function SortableCityRow({
    city,
    selected,
    disabled,
    onSelect,
}: {
    city: City;
    selected: boolean;
    disabled: boolean;
    onSelect: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: city.id,
        disabled,
    });

    return (
        <TableRow
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={cn('cursor-pointer', isDragging && 'relative z-10 opacity-80')}
            data-state={selected ? 'selected' : undefined}
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(event) => {
                if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
                event.preventDefault();
                onSelect();
            }}
        >
            <TableCell className="w-10">
                <button
                    type="button"
                    className="flex size-8 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing"
                    aria-label={`Reorder ${city.name}`}
                    onClick={(event) => event.stopPropagation()}
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="size-4" />
                </button>
            </TableCell>
            <TableCell>{city.name}</TableCell>
            <TableCell className="text-right">{city.videos.length}</TableCell>
        </TableRow>
    );
}

export default function CitiesPage() {
    const queryClient = useQueryClient();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const citiesQuery = orpc.admin.cities.list.queryOptions({});
    const { data: cities = [], isLoading } = useQuery(citiesQuery);
    const form = useForm<CityFormValues>({ resolver: zodResolver(cityFormSchema), defaultValues: emptyCity });
    const videosField = useFieldArray({ control: form.control, name: 'videos' });
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    function selectCity(city: City) {
        setSelectedId(city.id);
        form.reset({ ...city, videos: city.videos.map((value) => ({ value })) });
    }

    function newCity() {
        setSelectedId(null);
        form.reset({ ...emptyCity, position: Math.max(-1, ...cities.map((city) => city.position)) + 1 });
    }

    const saveMutation = useMutation({
        mutationFn: (values: CityFormValues) => {
            const input = { ...values, videos: values.videos.map(({ value }) => value).filter(Boolean) };
            return selectedId
                ? client.admin.cities.update({ ...input, id: selectedId })
                : client.admin.cities.create(input);
        },
        onSuccess: (city) => {
            queryClient.invalidateQueries({ queryKey: citiesQuery.queryKey });
            setSelectedId(city.id);
            form.reset({ ...city, videos: city.videos.map((value) => ({ value })) });
        },
        onError: (error) => {
            if (error.message.includes('already exists')) {
                form.setError('id', { message: 'A city with this ID already exists' });
            }
        },
    });

    const reorderMutation = useMutation({
        mutationFn: (orderedCities: City[]) =>
            Promise.all(
                orderedCities.map((city, position) =>
                    city.position === position ? city : client.admin.cities.update({ id: city.id, position }),
                ),
            ),
        onMutate: async (orderedCities) => {
            await queryClient.cancelQueries({ queryKey: citiesQuery.queryKey });
            const previousCities = queryClient.getQueryData<City[]>(citiesQuery.queryKey);
            queryClient.setQueryData(
                citiesQuery.queryKey,
                orderedCities.map((city, position) => ({ ...city, position })),
            );
            return { previousCities };
        },
        onError: (_error, _orderedCities, context) => {
            if (context?.previousCities) queryClient.setQueryData(citiesQuery.queryKey, context.previousCities);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: citiesQuery.queryKey }),
    });

    function reorderCities(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id || reorderMutation.isPending) return;
        const from = cities.findIndex((city) => city.id === active.id);
        const to = cities.findIndex((city) => city.id === over.id);
        if (from === -1 || to === -1) return;

        const orderedCities = arrayMove(cities, from, to);
        const selectedPosition = orderedCities.findIndex((city) => city.id === selectedId);
        if (selectedPosition !== -1) form.setValue('position', selectedPosition);
        reorderMutation.mutate(orderedCities);
    }

    return (
        <>
            <SiteHeader title="Cities" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="flex justify-end">
                    <Button type="button" onClick={newCity}>
                        <Plus data-icon="inline-start" />
                        New City
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Map cities</CardTitle>
                            <CardDescription>{cities.length} cities. Drag to reorder.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                                onDragEnd={reorderCities}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-10" />
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-right">Videos</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <SortableContext
                                        items={cities.map((city) => city.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <TableBody>
                                            {cities.map((city) => (
                                                <SortableCityRow
                                                    key={city.id}
                                                    city={city}
                                                    selected={selectedId === city.id}
                                                    disabled={reorderMutation.isPending}
                                                    onSelect={() => selectCity(city)}
                                                />
                                            ))}
                                            {!isLoading && cities.length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={3}
                                                        className="text-center text-muted-foreground"
                                                    >
                                                        No cities yet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </SortableContext>
                                </Table>
                            </DndContext>
                            {reorderMutation.error && (
                                <p className="mt-3 text-sm text-destructive">Failed to save the city order.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-3">
                        <CardHeader>
                            <CardTitle>{selectedId ? 'Edit city' : 'New city'}</CardTitle>
                            <CardDescription>Images continue to use the city ID as their filename.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ID (slug)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            readOnly={selectedId != null}
                                                            disabled={selectedId != null}
                                                        />
                                                    </FormControl>
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
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="smallName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Short name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(event) =>
                                                                field.onChange(event.target.value || null)
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="subtitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subtitle</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hidden"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center gap-3">
                                                <FormLabel>Hidden from public website</FormLabel>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="bounds"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zone</FormLabel>
                                                <FormControl>
                                                    <CityBoundsMap
                                                        key={selectedId ?? 'new'}
                                                        bounds={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <p className="text-sm text-muted-foreground">
                                                    Click to position the zone, then drag its corner handles to resize
                                                    it.
                                                </p>
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
                                                    <Textarea rows={2} {...field} />
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
                                                    <Textarea rows={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                        <SortableFieldList
                                            form={form}
                                            name="videos"
                                            fields={videosField.fields}
                                            placeholder="https://..."
                                            onMove={videosField.move}
                                            onRemove={videosField.remove}
                                            reorderable
                                        />
                                    </div>

                                    {saveMutation.error && (
                                        <p className="text-sm text-destructive">{saveMutation.error.message}</p>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Button type="submit" disabled={saveMutation.isPending}>
                                            {saveMutation.isPending ? 'Saving...' : 'Save city'}
                                        </Button>
                                        {selectedId && (
                                            <Button type="button" variant="outline" onClick={newCity}>
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
