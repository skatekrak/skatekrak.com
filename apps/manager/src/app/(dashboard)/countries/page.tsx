'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { createCountryInput, type Country } from '@krak/contracts';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Dialog,
    DialogTrigger,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Label,
    Switch,
    Textarea,
} from '@krak/ui';
import { countrySlug, getCountryFlagPath } from '@krak/utils';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';

import { SortableFieldList } from '../maps/_components/sortable-field-list';
import { CountryLocationPreview } from './CountryLocationPreview';
import { CreateCountryDialog } from './CreateCountryDialog';

import type { CatalogCountry } from '@/data/countries';

const countryFormSchema = createCountryInput.omit({ videos: true, soundtrack: true }).extend({
    videos: z.array(z.object({ value: createCountryInput.shape.videos.element })),
    soundtrack: z.array(z.object({ value: createCountryInput.shape.soundtrack.element })),
});
type CountryFormValues = z.infer<typeof countryFormSchema>;

const emptyCountry = {
    id: '',
    code: '',
    name: '',
    subtitle: '',
    edito: '',
    about: '',
    videos: [],
    soundtrack: [],
    bounds: [
        [0, 0],
        [0, 0],
    ],
    hidden: true,
} satisfies CountryFormValues;

export default function CountriesPage() {
    const queryClient = useQueryClient();
    const countriesQuery = orpc.admin.countries.list.queryOptions({});
    const { data: countries = [], isPending, error, refetch } = useQuery(countriesQuery);
    const [search, setSearch] = useState('');
    const query = countrySlug(search);
    const matchingCountries = countries.filter(({ name, code }) => countrySlug(`${name} ${code}`).includes(query));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [creatingCountry, setCreatingCountry] = useState(false);
    const form = useForm<CountryFormValues>({ resolver: zodResolver(countryFormSchema), defaultValues: emptyCountry });
    const videos = useFieldArray({ control: form.control, name: 'videos' });
    const soundtrack = useFieldArray({ control: form.control, name: 'soundtrack' });

    function resetEditor(country?: Country) {
        setSelectedId(country?.id ?? null);
        form.reset(
            country
                ? {
                      ...country,
                      videos: country.videos.map((value) => ({ value })),
                      soundtrack: country.soundtrack.map((value) => ({ value })),
                  }
                : emptyCountry,
        );
        saveMutation.reset();
        deleteMutation.reset();
    }

    const saveMutation = useMutation({
        mutationFn: (values: CountryFormValues) => {
            const input = {
                ...values,
                videos: values.videos.map(({ value }) => value),
                soundtrack: values.soundtrack.map(({ value }) => value),
            };
            return client.admin.countries.update(input);
        },
        onSuccess: (country) => {
            queryClient.invalidateQueries({ queryKey: countriesQuery.queryKey });
            setSelectedId(country.id);
            form.reset({
                ...country,
                videos: country.videos.map((value) => ({ value })),
                soundtrack: country.soundtrack.map((value) => ({ value })),
            });
        },
    });

    const createMutation = useMutation({
        mutationFn: (country: CatalogCountry) =>
            client.admin.countries.create({
                ...emptyCountry,
                id: country.slug,
                code: country.code,
                name: country.name,
                bounds: country.bounds,
            }),
        onSuccess: (country) => {
            queryClient.setQueryData(countriesQuery.queryKey, (previous = []) =>
                [...previous, country].toSorted((a, b) => a.name.localeCompare(b.name)),
            );
            queryClient.invalidateQueries({ queryKey: countriesQuery.queryKey });
            resetEditor(country);
            setCreatingCountry(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => client.admin.countries.delete({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: countriesQuery.queryKey });
            resetEditor();
        },
    });

    const busy = saveMutation.isPending || deleteMutation.isPending || createMutation.isPending;

    function selectCountry(country?: Country) {
        if (form.formState.isDirty && !window.confirm('Discard your unsaved country changes?')) return;
        resetEditor(country);
    }

    return (
        <>
            <SiteHeader
                title="Countries"
                rightActions={
                    <Dialog
                        open={creatingCountry}
                        onOpenChange={(open) => {
                            if (createMutation.isPending) return;
                            if (open) createMutation.reset();
                            setCreatingCountry(open);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button type="button" disabled={busy || isPending || !!error}>
                                <Plus data-icon="inline-start" />
                                New country
                            </Button>
                        </DialogTrigger>
                        {creatingCountry && (
                            <CreateCountryDialog
                                countries={countries}
                                onCreate={(country) => {
                                    if (
                                        form.formState.isDirty &&
                                        !window.confirm('Discard your unsaved country changes?')
                                    )
                                        return;
                                    createMutation.mutate(country);
                                }}
                                onClose={() => setCreatingCountry(false)}
                                isPending={createMutation.isPending}
                                error={createMutation.error}
                            />
                        )}
                    </Dialog>
                }
            />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="grid grid-cols-1 gap-6 xl:min-h-96 xl:grid-cols-3">
                    <Card className="flex min-h-0 flex-col xl:[contain:size]">
                        <CardHeader className="shrink-0">
                            <CardTitle>Countries</CardTitle>
                            <CardDescription>{countries.length} destinations</CardDescription>
                            <div className="flex flex-col gap-2 pt-2">
                                <Label htmlFor="country-search">Search countries</Label>
                                <Input
                                    id="country-search"
                                    type="search"
                                    placeholder="Name or ISO code..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="flex max-h-96 min-h-0 flex-1 flex-col gap-2 overflow-y-auto xl:max-h-none">
                            {isPending && <p role="status">Loading countries...</p>}
                            {error && (
                                <div role="alert">
                                    <p>Could not load countries.</p>
                                    <Button variant="outline" onClick={() => refetch()}>
                                        Try again
                                    </Button>
                                </div>
                            )}
                            {!isPending && !error && matchingCountries.length === 0 && (
                                <p role="status" className="text-sm text-muted-foreground">
                                    {countries.length
                                        ? 'No countries match your search.'
                                        : 'No countries yet. Create your first destination.'}
                                </p>
                            )}
                            {matchingCountries.map((country) => (
                                <Button
                                    key={country.id}
                                    type="button"
                                    variant={selectedId === country.id ? 'secondary' : 'ghost'}
                                    className="h-auto shrink-0 justify-start whitespace-normal text-left"
                                    disabled={busy}
                                    onClick={() => selectCountry(country)}
                                >
                                    <img
                                        src={getCountryFlagPath(country.id, country.code)}
                                        alt=""
                                        width={24}
                                        height={16}
                                        className="h-4 w-6 shrink-0 object-contain"
                                        loading="lazy"
                                    />
                                    <span className="min-w-0 flex-1 break-words">
                                        {country.name} ({country.code})
                                    </span>
                                    {country.hidden && <Badge variant="outline">Hidden</Badge>}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className="min-w-0 xl:col-span-2">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <CardTitle>{selectedId ? 'Edit country' : 'Select a country'}</CardTitle>
                                    <CardDescription>
                                        Set the destination view and editorial content. Countries have no spot feed.
                                    </CardDescription>
                                </div>
                                {form.watch('code') && (
                                    <img
                                        src={getCountryFlagPath(form.watch('id'), form.watch('code'))}
                                        alt={`${form.watch('name')} flag`}
                                        width={48}
                                        height={48}
                                        className="size-12 shrink-0 object-contain"
                                    />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {selectedId ? (
                                <Form {...form}>
                                    <form
                                        className="flex flex-col gap-6"
                                        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
                                    >
                                        <fieldset className="flex min-w-0 flex-col gap-4" disabled={busy}>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                {(['id', 'code', 'name'] as const).map((name) => (
                                                    <FormField
                                                        key={name}
                                                        control={form.control}
                                                        name={name}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    {name === 'id'
                                                                        ? 'ID (slug)'
                                                                        : name === 'code'
                                                                          ? 'ISO code'
                                                                          : 'Name'}
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} disabled />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="hidden"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center gap-3">
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                disabled={busy}
                                                            />
                                                        </FormControl>
                                                        <FormLabel>Hidden from public website</FormLabel>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="bounds"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Opening map view</FormLabel>
                                                        <CountryLocationPreview
                                                            bounds={field.value}
                                                            code={form.watch('code')}
                                                            disabled={busy}
                                                        />
                                                        <p className="text-sm text-muted-foreground">
                                                            Bounds are precomputed from country outlines. Panning this
                                                            preview does not change the saved view.
                                                        </p>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {(['subtitle', 'edito', 'about'] as const).map((name) => (
                                                <FormField
                                                    key={name}
                                                    control={form.control}
                                                    name={name}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                {name === 'subtitle'
                                                                    ? 'Subtitle'
                                                                    : name === 'edito'
                                                                      ? 'Editorial'
                                                                      : 'About'}
                                                            </FormLabel>
                                                            <FormControl>
                                                                {name === 'subtitle' ? (
                                                                    <Input {...field} />
                                                                ) : (
                                                                    <Textarea
                                                                        rows={name === 'edito' ? 3 : 5}
                                                                        {...field}
                                                                    />
                                                                )}
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                            {(['videos', 'soundtrack'] as const).map((name) => {
                                                const list = name === 'videos' ? videos : soundtrack;
                                                return (
                                                    <fieldset key={name} className="flex min-w-0 flex-col gap-2">
                                                        <legend className="mb-2 text-sm font-medium">
                                                            {name === 'videos' ? 'Videos' : 'Soundtrack'}
                                                        </legend>
                                                        <SortableFieldList
                                                            form={form}
                                                            name={name}
                                                            fields={list.fields}
                                                            placeholder={
                                                                name === 'videos' ? 'https://...' : 'Artist - Track'
                                                            }
                                                            onMove={list.move}
                                                            onRemove={list.remove}
                                                            reorderable
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="self-start"
                                                            onClick={() => list.append({ value: '' })}
                                                        >
                                                            <Plus data-icon="inline-start" />
                                                            Add {name === 'videos' ? 'video' : 'track'}
                                                        </Button>
                                                    </fieldset>
                                                );
                                            })}
                                        </fieldset>
                                        {saveMutation.error && (
                                            <p role="alert" className="text-sm text-destructive">
                                                {saveMutation.error.message}
                                            </p>
                                        )}
                                        {deleteMutation.error && (
                                            <p role="alert" className="text-sm text-destructive">
                                                {deleteMutation.error.message}
                                            </p>
                                        )}
                                        {saveMutation.isSuccess && !form.formState.isDirty && (
                                            <p role="status" className="text-sm text-muted-foreground">
                                                Country saved.
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Button type="submit" disabled={busy}>
                                                {saveMutation.isPending ? 'Saving...' : 'Save country'}
                                            </Button>
                                            {selectedId && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button type="button" variant="destructive" disabled={busy}>
                                                            Delete country
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete {form.getValues('name')}?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This permanently deletes the country and its editorial
                                                                content. This cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => deleteMutation.mutate(selectedId)}
                                                            >
                                                                Delete country
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Select a country from the list or use New country to create a destination.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
