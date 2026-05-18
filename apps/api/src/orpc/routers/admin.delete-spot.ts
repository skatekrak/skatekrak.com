import { ORPCError } from '@orpc/server';

import type { Prisma } from '@krak/prisma';

type DeleteSpotRecordInput = {
    spotId: string;
};

export async function deleteSpotRecord(tx: Prisma.TransactionClient, { spotId }: DeleteSpotRecordInput) {
    const spot = await tx.spot.findUnique({ where: { id: spotId }, select: { id: true } });

    if (!spot) {
        throw new ORPCError('NOT_FOUND', { message: `Spot '${spotId}' not found` });
    }

    await tx.spot.delete({ where: { id: spotId } });
}
