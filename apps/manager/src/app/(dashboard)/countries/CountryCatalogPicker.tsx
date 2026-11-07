'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState, type ComponentProps } from 'react';

import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@krak/ui';

import { countryCatalog, searchCountries, type CatalogCountry } from '@/data/countries';

type Props = Omit<ComponentProps<typeof Button>, 'value' | 'onSelect'> & {
    value: string;
    onSelect: (country: CatalogCountry) => void;
};

export function CountryCatalogPicker({ value, onSelect, disabled, ...props }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const searchId = useId();
    const selected = countryCatalog.find(({ code }) => code === value);
    const matches = searchCountries(query);

    return (
        <Popover
            open={open && !disabled}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) setQuery('');
            }}
        >
            <PopoverTrigger asChild>
                <Button
                    {...props}
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    <span className="truncate">
                        {selected ? `${selected.name} (${selected.code})` : value || 'Choose a country...'}
                    </span>
                    <ChevronDown data-icon="inline-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-2"
                aria-label="Choose a country"
            >
                <label htmlFor={searchId} className="sr-only">
                    Search countries
                </label>
                <Input
                    id={searchId}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by English name or code..."
                    autoComplete="off"
                />
                <ul className="mt-2 max-h-64 overflow-y-auto" aria-label="Countries">
                    {matches.map((country) => (
                        <li key={country.code}>
                            <Button
                                type="button"
                                variant={country.code === value ? 'secondary' : 'ghost'}
                                className="h-auto w-full justify-start whitespace-normal text-left"
                                onClick={() => {
                                    onSelect(country);
                                    setOpen(false);
                                    setQuery('');
                                }}
                            >
                                {country.name} ({country.code})
                            </Button>
                        </li>
                    ))}
                </ul>
                {matches.length === 0 && (
                    <p role="status" className="p-3 text-sm text-muted-foreground">
                        No countries match your search.
                    </p>
                )}
            </PopoverContent>
        </Popover>
    );
}
