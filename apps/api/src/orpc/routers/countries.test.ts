import { createRouterClient } from '@orpc/server';
import { afterEach, expect, mock, spyOn, test } from 'bun:test';

import { Prisma, type PrismaClient } from '@krak/prisma';

import { type AuthSession } from '../base';
import {
    createAdminCountry,
    deleteAdminCountry,
    listAdminCountries,
    updateAdminCountry,
    uploadCountryImage,
} from './adminCountries';
import { fetchCountry, listCountries } from './countries';

const country = {
    id: 'france',
    code: 'FR',
    name: 'France',
    subtitle: '',
    edito: 'Editorial',
    about: 'About',
    videos: [],
    soundtrack: ['Artist - Track'],
    bounds: [-5.2, 41.3, 9.7, 51.2],
    hidden: false,
    createdAt: new Date(),
    updatedAt: new Date(),
};
const countryInput = {
    ...country,
    bounds: [
        [-5.2, 41.3],
        [9.7, 51.2],
    ] as [[number, number], [number, number]],
};
const prisma = {
    country: {
        findMany: async (_args: Prisma.CountryFindManyArgs) => [country],
        findFirst: async (_args: Prisma.CountryFindFirstArgs): Promise<typeof country | null> => country,
        create: async (_args: Prisma.CountryCreateArgs) => country,
        update: async (_args: Prisma.CountryUpdateArgs) => country,
        delete: async (_args: Prisma.CountryDeleteArgs) => country,
    },
    map: { findUnique: async (_args: Prisma.MapFindUniqueArgs) => null },
};

function client(role?: 'ADMIN' | 'USER') {
    return createRouterClient(
        {
            list: listCountries,
            fetch: fetchCountry,
            admin: {
                list: listAdminCountries,
                create: createAdminCountry,
                update: updateAdminCountry,
                delete: deleteAdminCountry,
                upload: uploadCountryImage,
            },
        },
        {
            context: {
                headers: new Headers(),
                prisma: prisma as unknown as PrismaClient,
                session: role ? ({ user: { role } } as AuthSession) : null,
            },
        },
    );
}

afterEach(() => mock.restore());

test('public listing and fetching always exclude hidden countries', async () => {
    const list = spyOn(prisma.country, 'findMany').mockResolvedValue([country]);
    const fetch = spyOn(prisma.country, 'findFirst').mockResolvedValue(country);
    expect((await client().list())[0]?.id).toBe(country.id);
    expect(list).toHaveBeenCalledWith({ where: { hidden: false }, orderBy: { name: 'asc' } });
    expect((await client().fetch({ id: country.id })).bounds).toEqual(countryInput.bounds);
    expect(fetch).toHaveBeenCalledWith({ where: { id: country.id, hidden: false } });
    fetch.mockResolvedValue(null);
    await expect(client().fetch({ id: country.id })).rejects.toMatchObject({ code: 'NOT_FOUND' });
});

test('all manager operations require admin access', async () => {
    for (const role of [undefined, 'USER'] as const) {
        const admin = client(role).admin;
        for (const operation of [
            () => admin.list(),
            () => admin.create(countryInput),
            () => admin.update({ id: country.id, bounds: countryInput.bounds }),
            () => admin.delete({ id: country.id }),
            () => admin.upload({ id: country.id, file: new File([], 'image.png') }),
        ]) {
            await expect(operation()).rejects.toMatchObject({ code: role ? 'FORBIDDEN' : 'UNAUTHORIZED' });
        }
    }
});

test('admin flattens selected zones in storage and returns paired corners without erasing editorial content', async () => {
    spyOn(prisma.map, 'findUnique').mockResolvedValue(null);
    const create = spyOn(prisma.country, 'create').mockResolvedValue(country);
    const update = spyOn(prisma.country, 'update').mockResolvedValue(country);
    expect((await client('ADMIN').admin.create(countryInput)).bounds).toEqual(countryInput.bounds);
    expect(create.mock.calls[0]?.[0].data.soundtrack).toEqual(country.soundtrack);
    expect(create.mock.calls[0]?.[0].data.bounds).toEqual(country.bounds);
    await client('ADMIN').admin.update({ id: country.id, bounds: countryInput.bounds });
    expect(update).toHaveBeenCalledWith({ where: { id: country.id }, data: { bounds: country.bounds } });
    await client('ADMIN').admin.update({ id: country.id, subtitle: 'New subtitle' });
    expect(update).toHaveBeenLastCalledWith({ where: { id: country.id }, data: { subtitle: 'New subtitle' } });
});

test('duplicate identity and missing records return actionable errors', async () => {
    spyOn(prisma.map, 'findUnique').mockResolvedValue(null);
    spyOn(prisma.country, 'create').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Duplicate', { code: 'P2002', clientVersion: 'test' }),
    );
    await expect(client('ADMIN').admin.create(countryInput)).rejects.toMatchObject({ code: 'CONFLICT' });
    spyOn(prisma.country, 'update').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Missing', { code: 'P2025', clientVersion: 'test' }),
    );
    await expect(client('ADMIN').admin.update({ id: 'missing' })).rejects.toMatchObject({ code: 'NOT_FOUND' });
    spyOn(prisma.country, 'delete').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Missing', { code: 'P2025', clientVersion: 'test' }),
    );
    await expect(client('ADMIN').admin.delete({ id: 'missing' })).rejects.toMatchObject({ code: 'NOT_FOUND' });
});
