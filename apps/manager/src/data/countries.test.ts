import { expect, test } from 'bun:test';

import { countryCatalog, countrySlug, searchCountries } from './countries';

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

test('country search excludes existing ISO codes, including legacy slugs, and conflicting IDs', () => {
    const existing = [
        { id: 'legacy-france-guide', code: 'FR' },
        { id: 'nepal', code: 'XX' },
    ];
    expect(searchCountries('france', existing)).toEqual([]);
    expect(searchCountries('FR', existing).some(({ code }) => code === 'FR')).toBe(false);
    expect(searchCountries('nepal', existing)).toEqual([]);
    expect(searchCountries('', existing)).toHaveLength(countryCatalog.length - 2);
    expect(searchCountries('curacao', existing).map(({ code }) => code)).toEqual(['CW']);
    expect(searchCountries('france')).toHaveLength(1);
});

test('country search has no available choices when the entire catalog already exists', () => {
    expect(
        searchCountries(
            '',
            countryCatalog.map(({ slug, code }) => ({ id: slug, code })),
        ),
    ).toEqual([]);
});
