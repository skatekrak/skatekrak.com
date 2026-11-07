import type { Country } from '@krak/contracts';

import snapshot from '../../public/data/countries.json';

export type CatalogCountry = Pick<Country, 'code' | 'name' | 'bounds'> & { latitude: number; longitude: number };

// The offline generator and its tests validate this checked-in snapshot.
export const countryCatalog = snapshot.countries as CatalogCountry[];
const normalize = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

export function searchCountries(query: string) {
    const search = normalize(query.trim());
    return countryCatalog.filter(({ name, code }) => normalize(`${name} ${code}`).includes(search));
}

export function countrySlug(name: string) {
    return normalize(name)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
