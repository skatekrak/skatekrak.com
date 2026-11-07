import { expect, test } from 'bun:test';

import { countrySlug, searchCountries } from './countries';

test('country search matches English names and codes without case or accent sensitivity', () => {
    expect(searchCountries('  gb ').some(({ name }) => name === 'United Kingdom')).toBe(true);
    expect(searchCountries('curacao').some(({ code }) => code === 'CW')).toBe(true);
    expect(searchCountries('Åland').some(({ code }) => code === 'AX')).toBe(true);
    expect(searchCountries('unknown-country')).toHaveLength(0);
});

test('country slug suggestions remain URL-safe for names with accents and punctuation', () => {
    expect(countrySlug('Åland Islands')).toBe('aland-islands');
    expect(countrySlug('United Kingdom')).toBe('united-kingdom');
    expect(countrySlug('Saint Barthélemy')).toBe('saint-barthelemy');
});
