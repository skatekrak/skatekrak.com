import { call } from '@orpc/server';
import { PrismaPg } from '@prisma/adapter-pg';
import { expect, test } from 'bun:test';

import { createId, Prisma, PrismaClient } from '@krak/prisma';

import { listInBounds } from './spots.list-in-bounds';

// Run against a migrated test database with TEST_DATABASE_URL; fixtures are rolled back.
test.skipIf(!process.env.TEST_DATABASE_URL)('selects valid covers and limits media inside SQL', async () => {
    const prisma = new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL }),
        log: [{ emit: 'event', level: 'query' }],
    });
    const queries: string[] = [];
    prisma.$on('query', ({ query }) => queries.push(query));
    const rollback = new Error('Roll back test fixtures');

    try {
        await expect(
            prisma.$transaction(async (tx) => {
                const profile = await tx.profile.create({
                    data: { user: { create: { username: `thumbnail-${createId()}` } } },
                });
                const spotIds = [createId(), createId(), createId()];
                await tx.spot.createMany({
                    data: spotIds.map((id) => ({
                        id,
                        name: id,
                        latitude: 1,
                        longitude: 1,
                        type: 'STREET',
                        addedById: profile.id,
                    })),
                });

                const now = Date.now();
                const image = { provider: 's3', key: 'thumbnail.webp', width: 1200, height: 800 };
                const base = {
                    addedById: profile.id,
                    spotId: spotIds[0],
                    type: 'IMAGE' as const,
                    createdAt: new Date(now - 60_000),
                };
                const photoId = createId();
                const videoId = createId();
                await tx.media.createMany({
                    data: [
                        { ...base, id: photoId, image, createdAt: new Date(now - 120_000) },
                        { ...base, image: Prisma.JsonNull, video: Prisma.JsonNull },
                        { ...base, image: Prisma.DbNull, video: Prisma.DbNull },
                        { ...base, image, releaseDate: new Date(now + 60_000) },
                        { ...base, image, createdAt: new Date(now + 60_000) },
                        ...[spotIds[0], spotIds[1]].map((spotId) => ({
                            ...base,
                            id: spotId === spotIds[1] ? videoId : createId(),
                            spotId,
                            type: 'VIDEO' as const,
                            video: { publicId: 'video', version: '', url: '', format: 'mp4', width: 100, height: 100 },
                        })),
                        { ...base, spotId: spotIds[2], image: Prisma.JsonNull, video: Prisma.JsonNull },
                        ...Array.from({ length: 100 }, () => ({
                            ...base,
                            image,
                            createdAt: new Date(now - 180_000),
                        })),
                    ],
                });

                queries.length = 0;
                const result = await call(
                    listInBounds,
                    {
                        northEast: { latitude: 2, longitude: 2 },
                        southWest: { latitude: 0, longitude: 0 },
                        offset: 0,
                        limit: 20,
                    },
                    { context: { prisma: tx as PrismaClient, headers: new Headers(), session: null } },
                );

                expect(result.find(({ spot }) => spot.id === spotIds[0])?.mediaThumbnail?.id).toBe(photoId);
                expect(result.find(({ spot }) => spot.id === spotIds[1])?.mediaThumbnail?.id).toBe(videoId);
                expect(result.find(({ spot }) => spot.id === spotIds[2])?.mediaThumbnail).toBeNull();
                expect(queries).toHaveLength(1);
                expect(queries[0]).toContain('LATERAL');
                expect(queries[0]).toMatch(/"createdAt" DESC LIMIT \$\d+/);
                throw rollback;
            }),
        ).rejects.toBe(rollback);
    } finally {
        await prisma.$disconnect();
    }
});
