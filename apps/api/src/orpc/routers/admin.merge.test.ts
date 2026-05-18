import { describe, expect, test } from 'bun:test';

import { mergeSpotRecords } from './admin.merge';

type Row = {
    id: string;
    createdAt: Date;
    spotId?: string | null;
    profileId?: string;
    mergeIntoId?: string | null;
    trickDone?: unknown;
};

function statAll(value: unknown) {
    return (value as { all: number }).all;
}

function updateManyBySpot(rows: Row[], where: { spotId?: string; mergeIntoId?: string }, data: Partial<Row>) {
    for (const row of rows) {
        if (where.spotId !== undefined && row.spotId !== where.spotId) continue;
        if (where.mergeIntoId !== undefined && row.mergeIntoId !== where.mergeIntoId) continue;
        Object.assign(row, data);
    }
}

function makeTx() {
    const spots = new Set(['source', 'target']);
    const media: Row[] = [
        { id: 'source-media', spotId: 'source', createdAt: new Date('2026-05-01T00:00:00.000Z'), trickDone: {} },
        { id: 'target-media', spotId: 'target', createdAt: new Date('2026-05-02T00:00:00.000Z'), trickDone: null },
    ];
    const clips: Row[] = [
        { id: 'source-clip', spotId: 'source', createdAt: new Date('2026-05-03T00:00:00.000Z') },
        { id: 'target-clip', spotId: 'target', createdAt: new Date('2026-05-04T00:00:00.000Z') },
    ];
    const comments: Row[] = [
        { id: 'source-comment', spotId: 'source', createdAt: new Date('2026-05-05T00:00:00.000Z') },
        { id: 'target-comment', spotId: 'target', createdAt: new Date('2026-05-06T00:00:00.000Z') },
    ];
    const spotEdits: Row[] = [
        { id: 'source-to-target-edit', spotId: 'source', mergeIntoId: 'target', createdAt: new Date() },
        { id: 'target-to-source-edit', spotId: 'target', mergeIntoId: 'source', createdAt: new Date() },
        { id: 'external-to-source-edit', spotId: 'external', mergeIntoId: 'source', createdAt: new Date() },
    ];
    const follows: Row[] = [
        { id: 'duplicate-source-follow', spotId: 'source', profileId: 'profile-a', createdAt: new Date() },
        { id: 'existing-target-follow', spotId: 'target', profileId: 'profile-a', createdAt: new Date() },
        { id: 'source-only-follow', spotId: 'source', profileId: 'profile-b', createdAt: new Date() },
    ];
    let targetStatUpdate: Record<string, unknown> | null = null;

    return {
        state: {
            spots,
            media,
            clips,
            comments,
            spotEdits,
            follows,
            get targetStatUpdate() {
                return targetStatUpdate;
            },
        },
        tx: {
            spot: {
                findUnique: async ({ where }: { where: { id: string } }) =>
                    spots.has(where.id) ? { id: where.id } : null,
                update: async ({ data }: { data: Record<string, unknown> }) => {
                    targetStatUpdate = data;
                },
                delete: async ({ where }: { where: { id: string } }) => {
                    spots.delete(where.id);
                },
            },
            media: {
                updateMany: async ({ where, data }: { where: { spotId: string }; data: Partial<Row> }) =>
                    updateManyBySpot(media, where, data),
                findMany: async ({ where }: { where: { spotId: string } }) =>
                    media.filter((row) => row.spotId === where.spotId),
            },
            clip: {
                updateMany: async ({ where, data }: { where: { spotId: string }; data: Partial<Row> }) =>
                    updateManyBySpot(clips, where, data),
                findMany: async ({ where }: { where: { spotId: string } }) =>
                    clips.filter((row) => row.spotId === where.spotId),
            },
            comment: {
                updateMany: async ({ where, data }: { where: { spotId: string }; data: Partial<Row> }) =>
                    updateManyBySpot(comments, where, data),
                findMany: async ({ where }: { where: { spotId: string } }) =>
                    comments.filter((row) => row.spotId === where.spotId),
            },
            spotEdit: {
                updateMany: async ({
                    where,
                    data,
                }: {
                    where: { spotId?: string | { in: string[] }; mergeIntoId?: string | { in: string[] } };
                    data: Partial<Row>;
                }) => {
                    for (const row of spotEdits) {
                        const spotMatches =
                            where.spotId == null ||
                            (typeof where.spotId === 'string'
                                ? row.spotId === where.spotId
                                : where.spotId.in.includes(row.spotId ?? ''));
                        const mergeMatches =
                            where.mergeIntoId == null ||
                            (typeof where.mergeIntoId === 'string'
                                ? row.mergeIntoId === where.mergeIntoId
                                : where.mergeIntoId.in.includes(row.mergeIntoId ?? ''));
                        if (spotMatches && mergeMatches) Object.assign(row, data);
                    }
                },
            },
            profileSpotFollow: {
                findMany: async ({ where }: { where: { spotId: string } }) =>
                    follows.filter((row) => row.spotId === where.spotId),
                deleteMany: async ({ where }: { where: { spotId: string; profileId: { in: string[] } } }) => {
                    for (let index = follows.length - 1; index >= 0; index -= 1) {
                        const row = follows[index];
                        if (row.spotId === where.spotId && where.profileId.in.includes(row.profileId ?? ''))
                            follows.splice(index, 1);
                    }
                },
                updateMany: async ({ where, data }: { where: { spotId: string }; data: Partial<Row> }) =>
                    updateManyBySpot(follows, where, data),
            },
        },
    };
}

describe('mergeSpotRecords', () => {
    test('moves source spot records into target and deletes duplicate follows', async () => {
        const { tx, state } = makeTx();

        await mergeSpotRecords(tx as never, { sourceSpotId: 'source', targetSpotId: 'target' });

        expect(state.spots.has('source')).toBe(false);
        expect(state.media.every((row) => row.spotId === 'target')).toBe(true);
        expect(state.clips.every((row) => row.spotId === 'target')).toBe(true);
        expect(state.comments.every((row) => row.spotId === 'target')).toBe(true);
        expect(state.follows.map((row) => `${row.profileId}:${row.spotId}`).toSorted()).toEqual([
            'profile-a:target',
            'profile-b:target',
        ]);
    });

    test('avoids self-merge edits and recomputes target stats', async () => {
        const { tx, state } = makeTx();

        await mergeSpotRecords(tx as never, { sourceSpotId: 'source', targetSpotId: 'target' });

        expect(state.spotEdits.find((row) => row.id === 'source-to-target-edit')).toMatchObject({
            spotId: 'target',
            mergeIntoId: null,
        });
        expect(state.spotEdits.find((row) => row.id === 'target-to-source-edit')).toMatchObject({
            spotId: 'target',
            mergeIntoId: null,
        });
        expect(state.spotEdits.find((row) => row.id === 'external-to-source-edit')).toMatchObject({
            spotId: 'external',
            mergeIntoId: 'target',
        });
        expect(statAll(state.targetStatUpdate?.mediasStat)).toBe(2);
        expect(statAll(state.targetStatUpdate?.clipsStat)).toBe(2);
        expect(statAll(state.targetStatUpdate?.commentsStat)).toBe(2);
        expect(statAll(state.targetStatUpdate?.tricksDoneStat)).toBe(1);
    });
});
