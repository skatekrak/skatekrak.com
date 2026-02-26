import { ORPCError } from '@orpc/server';

import { os, authed } from '../base';
import { formatCloudinaryFile } from '../formatters';

export const me = os.profiles.me.use(authed).handler(async ({ context }) => {
    const profile = await context.prisma.profile.findUnique({
        where: { userId: context.session.user.id },
        select: {
            id: true,
            profilePicture: true,
            user: {
                select: {
                    username: true,
                },
            },
        },
    });

    if (!profile) {
        throw new ORPCError('NOT_FOUND', { message: 'Profile not found' });
    }

    return {
        id: profile.id,
        username: profile.user.username,
        profilePicture: formatCloudinaryFile(profile.profilePicture) ?? null,
    };
});
