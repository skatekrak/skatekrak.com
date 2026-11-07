'use client';

import { Check } from 'lucide-react';
import { useId, useState } from 'react';

import type { Country } from '@krak/contracts';
import {
    Button,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
} from '@krak/ui';
import { getCountryFlagPath } from '@krak/utils';

import { searchCountries, type CatalogCountry } from '@/data/countries';

export function CreateCountryDialog({
    countries,
    onCreate,
    onClose,
    isPending,
    error,
}: {
    countries: Country[];
    onCreate: (country: CatalogCountry) => void;
    onClose: () => void;
    isPending: boolean;
    error: Error | null;
}) {
    const [query, setQuery] = useState('');
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const searchId = useId();
    const matches = searchCountries(query, countries);
    const selected = matches.find(({ code }) => code === selectedCode);

    return (
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col">
            <DialogHeader>
                <DialogTitle>New country</DialogTitle>
                <DialogDescription>
                    Choose a country to create a hidden destination with empty editorial content. Existing countries are
                    not shown.
                </DialogDescription>
            </DialogHeader>
            <form
                className="flex min-h-0 flex-col gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (selected && !isPending) onCreate(selected);
                }}
            >
                <div className="flex flex-col gap-2">
                    <Label htmlFor={searchId}>Search countries</Label>
                    <Input
                        id={searchId}
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setSelectedCode(null);
                        }}
                        placeholder="Search by English name or ISO code..."
                        autoComplete="off"
                        disabled={isPending}
                    />
                </div>
                <ul className="min-h-0 max-h-64 overflow-y-auto" aria-label="Available countries">
                    {matches.map((country) => (
                        <li key={country.code}>
                            <Button
                                type="button"
                                variant={country.code === selectedCode ? 'secondary' : 'ghost'}
                                className="h-auto w-full justify-start whitespace-normal text-left"
                                aria-pressed={country.code === selectedCode}
                                disabled={isPending}
                                onClick={() => setSelectedCode(country.code)}
                            >
                                <img
                                    src={getCountryFlagPath(country.slug)}
                                    alt=""
                                    width={24}
                                    height={16}
                                    className="h-4 w-6 shrink-0 object-contain"
                                    loading="lazy"
                                />
                                <span className="min-w-0 flex-1 break-words">
                                    {country.name} ({country.code})
                                </span>
                                {country.code === selectedCode && <Check data-icon="inline-end" />}
                            </Button>
                        </li>
                    ))}
                </ul>
                {matches.length === 0 && (
                    <p role="status" className="text-sm text-muted-foreground">
                        {query.trim() ? 'No available countries match your search.' : 'All countries already exist.'}
                    </p>
                )}
                {error && (
                    <p role="alert" className="text-sm text-foreground">
                        Could not create country. {error.message}
                    </p>
                )}
                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!selected || isPending}>
                        {isPending ? 'Creating...' : 'Create country'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
