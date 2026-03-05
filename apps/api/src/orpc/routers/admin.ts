import type { Prisma } from '@krak/prisma';

import { os, authed, admin } from '../base';

// ============================================================================
// admin.users.list — Paginated, sortable user listing for admin dashboard
// ============================================================================

export const listUsers = os.admin.users.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, search } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.UserWhereInput = search
            ? {
                  OR: [
                      { username: { contains: search, mode: 'insensitive' } },
                      { email: { contains: search, mode: 'insensitive' } },
                  ],
              }
            : {};

        const [users, total] = await Promise.all([
            context.prisma.user.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    username: true,
                    displayUsername: true,
                    email: true,
                    role: true,
                    banned: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            context.prisma.user.count({ where }),
        ]);

        return {
            users: users.map((user) => ({
                ...user,
                role: user.role as 'USER' | 'MODERATOR' | 'ADMIN',
            })),
            total,
            page,
            perPage,
        };
    });
