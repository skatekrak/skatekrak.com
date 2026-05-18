import { ORPCError } from '@orpc/server';

import type { Prisma } from '@krak/prisma';

import { buildStat } from '../../helpers/stats';

type MergeSpotRecordsInput = {
    sourceSpotId: string;
    targetSpotId: string;
};

export async function mergeSpotRecords(
    tx: Prisma.TransactionClient,
    { sourceSpotId, targetSpotId }: MergeSpotRecordsInput,
) {
    const [sourceSpot, targetSpot] = await Promise.all([
        tx.spot.findUnique({ where: { id: sourceSpotId }, select: { id: true } }),
        tx.spot.findUnique({ where: { id: targetSpotId }, select: { id: true } }),
    ]);

    if (!sourceSpot) {
        throw new ORPCError('NOT_FOUND', { message: `Source spot '${sourceSpotId}' not found` });
    }

    if (!targetSpot) {
        throw new ORPCError('NOT_FOUND', { message: `Target spot '${targetSpotId}' not found` });
    }

    await tx.media.updateMany({
        where: { spotId: sourceSpotId },
        data: { spotId: targetSpotId },
    });

    await tx.clip.updateMany({
        where: { spotId: sourceSpotId },
        data: { spotId: targetSpotId },
    });

    await tx.comment.updateMany({
        where: { spotId: sourceSpotId },
        data: { spotId: targetSpotId },
    });

    await tx.spotEdit.updateMany({
        where: {
            spotId: { in: [sourceSpotId, targetSpotId] },
            mergeIntoId: { in: [sourceSpotId, targetSpotId] },
        },
        data: { mergeIntoId: null },
    });

    await tx.spotEdit.updateMany({
        where: { spotId: sourceSpotId },
        data: { spotId: targetSpotId },
    });

    await tx.spotEdit.updateMany({
        where: { mergeIntoId: sourceSpotId },
        data: { mergeIntoId: targetSpotId },
    });

    const targetFollowers = await tx.profileSpotFollow.findMany({
        where: { spotId: targetSpotId },
        select: { profileId: true },
    });
    const targetFollowerIds = targetFollowers.map((follow: { profileId: string }) => follow.profileId);

    if (targetFollowerIds.length > 0) {
        await tx.profileSpotFollow.deleteMany({
            where: {
                spotId: sourceSpotId,
                profileId: { in: targetFollowerIds },
            },
        });
    }

    await tx.profileSpotFollow.updateMany({
        where: { spotId: sourceSpotId },
        data: { spotId: targetSpotId },
    });

    const [allTargetMedias, allTargetClips, allTargetComments] = await Promise.all([
        tx.media.findMany({
            where: { spotId: targetSpotId },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true, trickDone: true },
        }),
        tx.clip.findMany({
            where: { spotId: targetSpotId },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
        }),
        tx.comment.findMany({
            where: { spotId: targetSpotId },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
        }),
    ]);

    await tx.spot.update({
        where: { id: targetSpotId },
        data: {
            mediasStat: buildStat(allTargetMedias),
            clipsStat: buildStat(allTargetClips),
            commentsStat: buildStat(allTargetComments),
            tricksDoneStat: buildStat(
                allTargetMedias.filter((media: { trickDone: unknown }) => media.trickDone != null),
            ),
        },
    });

    await tx.spot.delete({ where: { id: sourceSpotId } });
}
