import { expect, test } from 'bun:test';

import { countrySlug, getCountryFlagPath } from './countries';

test('flag URLs are inferred from catalog slugs', () => {
    expect(getCountryFlagPath('france')).toBe('/images/countries/france.svg');
    expect(getCountryFlagPath(countrySlug('Åland Islands'))).toBe('/images/countries/aland-islands.svg');
});

test('country codes resolve legacy and custom slugs without changing their URLs', () => {
    expect(getCountryFlagPath('usa', 'US')).toBe('/images/countries/united-states.svg');
    expect(getCountryFlagPath('my-destination', 'fr')).toBe('/images/countries/france.svg');
    expect(getCountryFlagPath('unknown', 'ZZ')).toBe('/images/countries/unknown.svg');
    expect(getCountryFlagPath('../unknown?x=1')).toBe('/images/countries/..%2Funknown%3Fx%3D1.svg');
});
