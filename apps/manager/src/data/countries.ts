import type { Country } from '@krak/contracts';

import snapshot from '../../public/data/countries.json';

export { countrySlug } from '@krak/utils';

export type CatalogCountry = Pick<Country, 'code' | 'name' | 'bounds'> & {
    slug: string;
    latitude: number;
    longitude: number;
};

// The offline generator and its tests validate this checked-in snapshot.
export const countryCatalog = snapshot.countries as CatalogCountry[];
const normalize = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

export function searchCountries(query: string, existingCountries: Pick<Country, 'id' | 'code'>[] = []) {
    const search = normalize(query.trim());
    return countryCatalog.filter(
        ({ name, code, slug }) =>
            normalize(`${name} ${code}`).includes(search) &&
            !existingCountries.some((country) => country.code === code || country.id === slug),
    );
}
