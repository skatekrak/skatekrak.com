import { ORPCError } from '@orpc/server';
import { describe, expect, test } from 'bun:test';

import { deleteSpotRecord } from './admin.delete-spot';

function makeTx() {
    const spots = new Set(['existing-spot']);

    return {
        state: { spots },
        tx: {
            spot: {
                findUnique: async ({ where }: { where: { id: string } }) =>
                    spots.has(where.id) ? { id: where.id } : null,
                delete: async ({ where }: { where: { id: string } }) => {
                    spots.delete(where.id);
                },
            },
        },
    };
}

describe('deleteSpotRecord', () => {
    test('deletes an existing spot', async () => {
        const { tx, state } = makeTx();

        await deleteSpotRecord(tx as never, { spotId: 'existing-spot' });

        expect(state.spots.has('existing-spot')).toBe(false);
    });

    test('throws when the spot does not exist', async () => {
        const { tx } = makeTx();

        const error = await deleteSpotRecord(tx as never, { spotId: 'missing-spot' }).catch((err: unknown) => err);

        expect(error).toBeInstanceOf(ORPCError);
        expect((error as ORPCError).code).toBe('NOT_FOUND');
    });
});
