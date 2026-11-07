import { ORPCError } from '@orpc/server';

import { os } from '../base';

export function serializeCountry<T extends { bounds: number[] }>(country: T) {
    return {
        ...country,
        bounds: [
            [country.bounds[0], country.bounds[1]],
            [country.bounds[2], country.bounds[3]],
        ] as [[number, number], [number, number]],
    };
}

export const listCountries = os.countries.list.handler(async ({ context }) => {
    const countries = await context.prisma.country.findMany({ where: { hidden: false }, orderBy: { name: 'asc' } });
    return countries.map(serializeCountry);
});

export const fetchCountry = os.countries.fetch.handler(async ({ context, input }) => {
    const country = await context.prisma.country.findFirst({ where: { id: input.id, hidden: false } });
    if (!country) throw new ORPCError('NOT_FOUND', { message: 'Country not found' });
    return serializeCountry(country);
});
