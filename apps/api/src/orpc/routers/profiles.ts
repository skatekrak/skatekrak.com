import { ORPCError } from '@orpc/server';

import { os, authed } from '../base';

type CloudinaryFile = {
    publicId: string;
    version: string;
    url: string;
    format: string;
    width: number;
    height: number;
};

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

    const pic = profile.profilePicture as CloudinaryFile | null;

    return {
        id: profile.id,
        username: profile.user.username,
        profilePicture: pic ? { ...pic, jpg: pic.url.replace(/\.webp$/, '.jpg') } : null,
    };
});
