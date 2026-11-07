import { ORPCError } from '@orpc/server';

import { Prisma } from '@krak/prisma';

import { admin, authed, os } from '../base';
import { serializeCountry } from './countries';

export const listAdminCountries = os.admin.countries.list
    .use(authed)
    .use(admin)
    .handler(async ({ context }) => {
        const countries = await context.prisma.country.findMany({ orderBy: { name: 'asc' } });
        return countries.map(serializeCountry);
    });

export const createAdminCountry = os.admin.countries.create
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        if (await context.prisma.map.findUnique({ where: { id: input.id } })) {
            throw new ORPCError('CONFLICT', {
                message: 'A map with this ID already exists. Migrate it to a country instead.',
            });
        }
        const { bounds, ...data } = input;
        try {
            const country = await context.prisma.country.create({ data: { ...data, bounds: bounds.flat() } });
            return serializeCountry(country);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ORPCError('CONFLICT', { message: 'A country with this ID or country code already exists' });
            }
            throw error;
        }
    });

export const updateAdminCountry = os.admin.countries.update
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, bounds, ...data } = input;
        try {
            const country = await context.prisma.country.update({
                where: { id },
                data: { ...data, ...(bounds ? { bounds: bounds.flat() } : {}) },
            });
            return serializeCountry(country);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') throw new ORPCError('NOT_FOUND', { message: 'Country not found' });
                if (error.code === 'P2002') {
                    throw new ORPCError('CONFLICT', { message: 'A country with this country code already exists' });
                }
            }
            throw error;
        }
    });

export const deleteAdminCountry = os.admin.countries.delete
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        try {
            await context.prisma.country.delete({ where: { id: input.id } });
            return { success: true };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new ORPCError('NOT_FOUND', { message: 'Country not found' });
            }
            throw error;
        }
    });

export const uploadCountryImage = os.admin.countries.uploadImage
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const country = await context.prisma.country.findUnique({ where: { id: input.id } });
        if (!country) throw new ORPCError('NOT_FOUND', { message: 'Country not found' });
        if (input.file.size > 10 * 1024 * 1024) {
            throw new ORPCError('BAD_REQUEST', { message: 'Images must be smaller than 10 MB' });
        }

        const { default: sharp } = await import('sharp');
        const { uploadToS3 } = await import('../../helpers/s3');
        let buffer: Buffer;
        try {
            buffer = await sharp(Buffer.from(await input.file.arrayBuffer()))
                .rotate()
                .png()
                .toBuffer();
        } catch {
            throw new ORPCError('BAD_REQUEST', { message: 'Please upload a valid image' });
        }

        // Keep the old map asset path so migrated countries retain their images.
        const path = `assets/maps/custom-maps/${country.id}.png`;
        await uploadToS3(path, buffer, 'image/png');
        return { path };
    });
