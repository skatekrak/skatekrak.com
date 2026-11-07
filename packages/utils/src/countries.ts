import { countryFlagSlugs } from './countryFlagSlugs';

export function countrySlug(name: string) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export function getCountryFlagPath(slug: string, code?: string) {
    // ISO codes keep legacy/custom URL slugs working without changing country records.
    const catalogSlug = code ? countryFlagSlugs[code.toUpperCase()] : undefined;
    return `/images/countries/${encodeURIComponent(catalogSlug ?? slug)}.svg`;
}
