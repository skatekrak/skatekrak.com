'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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

export default function CitiesPage() {
    const queryClient = useQueryClient();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { data: cities = [], isLoading } = useQuery(orpc.admin.cities.list.queryOptions({}));
    const form = useForm<CityFormValues>({ resolver: zodResolver(cityFormSchema), defaultValues: emptyCity });
    const videosField = useFieldArray({ control: form.control, name: 'videos' });

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
            queryClient.invalidateQueries({ queryKey: orpc.admin.cities.list.queryOptions({}).queryKey });
            setSelectedId(city.id);
            form.reset({ ...city, videos: city.videos.map((value) => ({ value })) });
        },
        onError: (error) => {
            if (error.message.includes('already exists')) {
                form.setError('id', { message: 'A city with this ID already exists' });
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => client.admin.cities.delete({ id }),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orpc.admin.cities.list.queryOptions({}).queryKey });
            if (selectedId === id) newCity();
        },
    });

    function deleteCity(city: City) {
        if (window.confirm(`Delete ${city.name}?`)) deleteMutation.mutate(city.id);
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

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Map cities</CardTitle>
                            <CardDescription>{cities.length} cities ordered by position.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right">Videos</TableHead>
                                        <TableHead className="w-12" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cities.map((city) => (
                                        <TableRow
                                            key={city.id}
                                            data-state={selectedId === city.id ? 'selected' : undefined}
                                        >
                                            <TableCell>{city.position}</TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="h-auto p-0"
                                                    onClick={() => selectCity(city)}
                                                >
                                                    {city.name}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">{city.videos.length}</TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Delete ${city.name}`}
                                                    onClick={() => deleteCity(city)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!isLoading && cities.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                No cities yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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
                                            name="position"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Position</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            {...field}
                                                            onChange={(event) =>
                                                                field.onChange(event.target.valueAsNumber)
                                                            }
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

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {(['bounds.0.0', 'bounds.0.1', 'bounds.1.0', 'bounds.1.1'] as const).map(
                                            (name, index) => (
                                                <FormField
                                                    key={name}
                                                    control={form.control}
                                                    name={name}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                {index % 2 === 0 ? 'Longitude' : 'Latitude'}{' '}
                                                                {Math.floor(index / 2) + 1}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="any"
                                                                    {...field}
                                                                    onChange={(event) =>
                                                                        field.onChange(event.target.valueAsNumber)
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            ),
                                        )}
                                    </div>

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

                                    {(saveMutation.error || deleteMutation.error) && (
                                        <p className="text-sm text-destructive">
                                            {saveMutation.error?.message ?? deleteMutation.error?.message}
                                        </p>
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
