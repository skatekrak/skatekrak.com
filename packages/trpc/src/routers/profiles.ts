import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../trpc';

type CloudinaryFile = {
    publicId: string;
    version: string;
    url: string;
    format: string;
    width: number;
    height: number;
};

export const profilesRouter = router({
    me: protectedProcedure.query(async ({ ctx }) => {
        const profile = await ctx.prisma.profile.findUnique({
            where: { userId: ctx.session.user.id },
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
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
        }

        const pic = profile.profilePicture as CloudinaryFile | null;

        return {
            id: profile.id,
            username: profile.user.username,
            profilePicture: pic
                ? { ...pic, jpg: pic.url.replace(/\.webp$/, '.jpg') }
                : null,
        };
    }),
});
