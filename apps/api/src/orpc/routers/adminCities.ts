import { ORPCError } from '@orpc/server';

import { admin, authed, os } from '../base';

function serializeCity<T extends { bounds: number[] }>(city: T) {
    return {
        ...city,
        bounds: [
            [city.bounds[0], city.bounds[1]],
            [city.bounds[2], city.bounds[3]],
        ] as [[number, number], [number, number]],
    };
}

export const createAdminCity = os.admin.cities.create
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const existing = await context.prisma.city.findUnique({ where: { id: input.id } });
        if (existing) {
            throw new ORPCError('CONFLICT', { message: `A city with ID "${input.id}" already exists` });
        }

        const { bounds, ...data } = input;
        const city = await context.prisma.city.create({ data: { ...data, bounds: bounds.flat() } });
        return serializeCity(city);
    });

export const updateAdminCity = os.admin.cities.update
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, bounds, ...data } = input;
        const existing = await context.prisma.city.findUnique({ where: { id } });
        if (!existing) {
            throw new ORPCError('NOT_FOUND', { message: `City "${id}" not found` });
        }

        const city = await context.prisma.city.update({
            where: { id },
            data: { ...data, ...(bounds ? { bounds: bounds.flat() } : {}) },
        });
        return serializeCity(city);
    });

export const deleteAdminCity = os.admin.cities.delete
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const existing = await context.prisma.city.findUnique({ where: { id: input.id } });
        if (!existing) {
            throw new ORPCError('NOT_FOUND', { message: `City "${input.id}" not found` });
        }

        await context.prisma.city.delete({ where: { id: input.id } });
        return { success: true };
    });
