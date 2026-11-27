import { addHashtagIfNeeded } from '../../helpers/hashtags';
import { admin, authed, os } from '../base';

// Raw SQL: Prisma can't group by unnested array values. Tagged templates keep params escaped.

/** Most used media hashtags, optionally filtered by substring (case-insensitive) */
export const listAdminHashtags = os.admin.hashtags.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        // shortcut: full scan of media on each call (no index can serve unnest+GROUP BY), fine under ~100k rows; move to a cron-refreshed materialized view past that
        const search = input.search?.trim().replace(/^#/, '').toLowerCase() ?? '';
        return context.prisma.$queryRaw<{ tag: string; mediaCount: number }[]>`
            SELECT tag, count(*)::int AS "mediaCount"
            FROM media, unnest(hashtags) AS tag
            WHERE ${search} = '' OR strpos(lower(tag), ${search}) > 0
            GROUP BY tag
            ORDER BY "mediaCount" DESC, tag
            LIMIT ${input.limit}
        `;
    });

/** Overview of one hashtag; array lookups hit the GIN indexes (media_hashtags_idx, spots_tags_idx) */
export const getAdminHashtag = os.admin.hashtags.get
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const tag = addHashtagIfNeeded(input.tag);
        const bare = tag.slice(1); // Spot.tags and Map.id are stored without '#'
        const needle = bare.toLowerCase();

        const [[counts], monthly, topSpots, topContributors, similar, map] = await Promise.all([
            context.prisma.$queryRaw<
                { mediaCount: number; spotCount: number; firstUsedAt: Date | null; lastUsedAt: Date | null }[]
            >`
                SELECT
                    m."mediaCount", m."firstUsedAt", m."lastUsedAt",
                    (SELECT count(*)::int FROM (
                        SELECT "spotId" FROM media WHERE hashtags @> ARRAY[${tag}]::text[] AND "spotId" IS NOT NULL
                        UNION
                        SELECT id FROM spots WHERE tags @> ARRAY[${bare}]::text[]
                    ) s) AS "spotCount"
                FROM (
                    SELECT count(*)::int AS "mediaCount", min("createdAt") AS "firstUsedAt", max("createdAt") AS "lastUsedAt"
                    FROM media WHERE hashtags @> ARRAY[${tag}]::text[]
                ) m
            `,
            context.prisma.$queryRaw<{ month: string; count: number }[]>`
                SELECT to_char(g.month, 'YYYY-MM') AS month, count(media.id)::int AS count
                FROM generate_series(
                    date_trunc('month', now()) - interval '11 months',
                    date_trunc('month', now()),
                    interval '1 month'
                ) AS g(month)
                LEFT JOIN media
                    ON date_trunc('month', media."createdAt") = g.month
                    AND media.hashtags @> ARRAY[${tag}]::text[]
                GROUP BY g.month
                ORDER BY g.month
            `,
            context.prisma.$queryRaw<
                {
                    id: string;
                    name: string;
                    city: string | null;
                    country: string | null;
                    mediaCount: number;
                    taggedDirectly: boolean;
                }[]
            >`
                WITH m AS (
                    SELECT "spotId", count(*)::int AS c FROM media
                    WHERE hashtags @> ARRAY[${tag}]::text[] AND "spotId" IS NOT NULL
                    GROUP BY "spotId"
                )
                SELECT s.id, s.name, s.city, s.country,
                    coalesce(m.c, 0)::int AS "mediaCount",
                    (s.tags @> ARRAY[${bare}]::text[]) AS "taggedDirectly"
                FROM spots s LEFT JOIN m ON m."spotId" = s.id
                WHERE s.id IN (SELECT "spotId" FROM m UNION SELECT id FROM spots WHERE tags @> ARRAY[${bare}]::text[])
                ORDER BY "mediaCount" DESC, s.name
                LIMIT 5
            `,
            context.prisma.$queryRaw<{ username: string; mediaCount: number }[]>`
                SELECT u.username, count(*)::int AS "mediaCount"
                FROM media m
                JOIN profiles p ON p.id = m."addedById"
                JOIN users u ON u.id = p."userId"
                WHERE m.hashtags @> ARRAY[${tag}]::text[]
                GROUP BY u.username
                ORDER BY "mediaCount" DESC, u.username
                LIMIT 3
            `,
            // shortcut: same full media scan as listAdminHashtags; fine at current volume
            context.prisma.$queryRaw<{ tag: string; mediaCount: number }[]>`
                SELECT t AS tag, count(*)::int AS "mediaCount"
                FROM media, unnest(hashtags) AS t
                WHERE t <> ${tag} AND strpos(lower(t), ${needle}) > 0
                GROUP BY t
                ORDER BY (lower(t) = ${`#${needle}`}) DESC, "mediaCount" DESC, t
                LIMIT 5
            `,
            context.prisma.map.findUnique({ where: { id: bare }, select: { id: true, name: true } }),
        ]);

        return {
            tag,
            mediaCount: counts?.mediaCount ?? 0,
            spotCount: counts?.spotCount ?? 0,
            firstUsedAt: counts?.firstUsedAt ?? null,
            lastUsedAt: counts?.lastUsedAt ?? null,
            monthly,
            topSpots,
            topContributors,
            similar,
            map,
        };
    });
