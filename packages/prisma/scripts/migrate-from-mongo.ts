/**
 * MongoDB → PostgreSQL Migration Script
 *
 * Reads data from the MongoDB `carrelage` database and inserts it into
 * the PostgreSQL database defined by the Prisma schema.
 *
 * Prerequisites:
 *   1. PostgreSQL is running and the schema has been pushed:
 *      DATABASE_URL="postgresql://krak:krak@localhost:5433/krak" bunx --bun prisma db push
 *   2. MongoDB is running with the carrelage database populated.
 *
 * Usage:
 *   MONGODB_URI="mongodb://localhost:27017/carrelage" \
 *   DATABASE_URL="postgresql://krak:krak@localhost:5433/krak" \
 *   bun run packages/prisma/scripts/migrate-from-mongo.ts
 *
 * The script is idempotent-ish: it wipes all PostgreSQL tables before inserting.
 * Run it as many times as needed during development.
 */

import { MongoClient, type Db, type Document as MongoDocument, ObjectId } from 'mongodb';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../node_modules/.prisma/client';
import { createId } from '@paralleldrive/cuid2';
import type {
    Role,
    SubscriptionStatus,
    Stance,
    SpotType,
    SpotStatus,
    Obstacle,
    MediaType,
    ClipProvider,
} from '../node_modules/.prisma/client';

type JsonNull = typeof Prisma.JsonNull;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/carrelage';
const BATCH_SIZE = 500;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(msg: string) {
    console.log(`[migrate] ${new Date().toISOString()} — ${msg}`);
}

function toDate(val: unknown): Date | null {
    if (!val) return null;
    const d = new Date(val as string | number | Date);
    return isNaN(d.getTime()) ? null : d;
}

function toDateRequired(val: unknown): Date {
    return toDate(val) ?? new Date();
}

function toStr(val: unknown): string | null {
    if (val === undefined || val === null) return null;
    return String(val);
}

/** Map MongoDB enum values to Prisma UPPER_CASE enums */
const roleMap: Record<string, Role> = {
    user: 'USER',
    moderator: 'MODERATOR',
    admin: 'ADMIN',
};

const subscriptionStatusMap: Record<string, SubscriptionStatus> = {
    active: 'ACTIVE',
    expired: 'EXPIRED',
    cancelled: 'CANCELLED',
    none: 'NONE',
};

const stanceMap: Record<string, Stance> = {
    goofy: 'GOOFY',
    regular: 'REGULAR',
};

const spotTypeMap: Record<string, SpotType> = {
    shop: 'SHOP',
    street: 'STREET',
    park: 'PARK',
    diy: 'DIY',
    private: 'PRIVATE',
};

const spotStatusMap: Record<string, SpotStatus> = {
    active: 'ACTIVE',
    wip: 'WIP',
    rip: 'RIP',
};

const obstacleMap: Record<string, Obstacle> = {
    stairs: 'STAIRS',
    gap: 'GAP',
    'street gap': 'STREET_GAP',
    ledge: 'LEDGE',
    hubba: 'HUBBA',
    bench: 'BENCH',
    'low to high': 'LOW_TO_HIGH',
    'manny pad': 'MANNY_PAD',
    slappy: 'SLAPPY',
    polejam: 'POLEJAM',
    jersey: 'JERSEY',
    drop: 'DROP',
    flatground: 'FLATGROUND',
    handrail: 'HANDRAIL',
    flatbar: 'FLATBAR',
    bump: 'BUMP',
    wallride: 'WALLRIDE',
    bank: 'BANK',
    tranny: 'TRANNY',
    spine: 'SPINE',
    ramp: 'RAMP',
    bowl: 'BOWL',
    quarterpipe: 'QUARTERPIPE',
    fullpipe: 'FULLPIPE',
    downhill: 'DOWNHILL',
    hip: 'HIP',
    other: 'OTHER',
};

const mediaTypeMap: Record<string, MediaType> = {
    image: 'IMAGE',
    video: 'VIDEO',
};

const clipProviderMap: Record<string, ClipProvider> = {
    youtube: 'YOUTUBE',
    vimeo: 'VIMEO',
};

function mapObstacles(obstacles: string[] | undefined): Obstacle[] {
    if (!obstacles || !Array.isArray(obstacles)) return [];
    return obstacles.map((o) => obstacleMap[o]).filter(Boolean);
}

function toCloudinaryJson(cf: MongoDocument | undefined | null): Prisma.InputJsonValue | JsonNull {
    if (!cf) return Prisma.JsonNull;
    if (!cf.url) return Prisma.JsonNull;
    return {
        publicId: cf.publicId ?? null,
        version: cf.version ?? null,
        url: cf.url,
        format: cf.format ?? null,
        width: cf.width ?? null,
        height: cf.height ?? null,
    };
}

function toStatJson(stat: MongoDocument | undefined | null): Prisma.InputJsonValue | JsonNull {
    if (!stat) return Prisma.JsonNull;
    return {
        all: stat.all ?? 0,
        monthly: stat.monthly ?? 0,
        weekly: stat.weekly ?? 0,
        daily: stat.daily ?? 0,
        createdAt: stat.createdAt ?? null,
    };
}

/** Convert a Mongo ObjectId to its hex string */
function oid(val: unknown): string {
    if (!val) return '';
    if (val instanceof ObjectId) return val.toHexString();
    if (typeof val === 'object' && val !== null && '$oid' in val) return String((val as any).$oid);
    return String(val);
}

// ---------------------------------------------------------------------------
// ID mapping registries
//
// MongoDB uses string _id for User/Profile (usernames) which map to new UUIDs.
// Content models (Spot, Media, Clip, etc.) keep their original MongoDB ObjectId
// hex strings as the Postgres primary key — no mapping needed.
// Embedded subdocs without a MongoDB _id get a new cuid2 ID via createId().
// ---------------------------------------------------------------------------

/** username → new postgres UUID */
const userIdMap = new Map<string, string>();
/** username → new postgres profile UUID */
const profileIdMap = new Map<string, string>();
/** Sets of mongo IDs that were successfully migrated (used for FK validation) */
const migratedSpotIds = new Set<string>();
const migratedMediaIds = new Set<string>();
const migratedClipIds = new Set<string>();

// ---------------------------------------------------------------------------
// Batch helper — run createMany in chunks to avoid memory issues
// ---------------------------------------------------------------------------

async function _batchCreate<T>(label: string, data: T[], fn: (batch: T[]) => Promise<unknown>): Promise<void> {
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        await fn(batch);
        log(`  ${label}: inserted ${Math.min(i + BATCH_SIZE, data.length)}/${data.length}`);
    }
}

// ---------------------------------------------------------------------------
// Migration steps
// ---------------------------------------------------------------------------

async function migrateUsers(db: Db, prisma: PrismaClient) {
    log('Migrating users...');
    const users = await db.collection('users').find().toArray();
    log(`  Found ${users.length} users in MongoDB`);

    // Insert one-by-one to capture generated IDs
    for (const u of users) {
        const username = String(u._id);
        const created = await prisma.user.create({
            data: {
                username,
                email: toStr(u.email),
                emailVerified: u.emailVerified ?? false,
                emailConfirmationToken: toStr(u.emailConfirmationToken),
                welcomeMailSent: u.welcomeMailSent ?? false,
                role: roleMap[u.role] ?? ('USER' as Role),
                resetPasswordToken: toStr(u.resetPasswordToken),
                resetPasswordExpires: toDate(u.resetPasswordExpires),
                receiveNewsletter: u.receiveNewsletter ?? false,
                subscriptionStatus: subscriptionStatusMap[u.subscriptionStatus] ?? ('NONE' as SubscriptionStatus),
                stripeCustomerId: toStr(u.stripeCustomerId),
                subscriptionEndAt: toDate(u.subscriptionEndAt),
                createdAt: toDateRequired(u.createdAt),
                updatedAt: toDateRequired(u.updatedAt),
            },
        });
        userIdMap.set(username, created.id);
    }

    log(`  Inserted ${users.length} users`);
}

async function migrateAccounts(db: Db, prisma: PrismaClient) {
    log('Migrating accounts (credential provider with password)...');
    const users = await db.collection('users').find().toArray();
    let count = 0;

    for (const u of users) {
        const username = String(u._id);
        const userId = userIdMap.get(username);
        if (!userId) continue;

        const password = toStr(u.password);
        if (!password) continue;

        await prisma.account.create({
            data: {
                userId,
                accountId: userId,
                providerId: 'credential',
                password,
                createdAt: toDateRequired(u.createdAt),
                updatedAt: toDateRequired(u.updatedAt),
            },
        });
        count++;
    }

    log(`  Inserted ${count} credential accounts`);
}

async function migrateProfiles(db: Db, prisma: PrismaClient) {
    log('Migrating profiles...');
    const profiles = await db.collection('profiles').find().toArray();
    log(`  Found ${profiles.length} profiles in MongoDB`);

    for (const p of profiles) {
        const username = String(p._id);
        const userId = userIdMap.get(username);
        if (!userId) {
            log(`  WARN: No user found for profile "${username}", skipping`);
            continue;
        }

        const created = await prisma.profile.create({
            data: {
                userId,
                description: toStr(p.description),
                location: toStr(p.location),
                stance: p.stance ? (stanceMap[p.stance] ?? null) : null,
                snapchat: toStr(p.snapchat),
                instagram: toStr(p.instagram),
                website: toStr(p.website),
                sponsors: Array.isArray(p.sponsors) ? p.sponsors.map(String) : [],
                profilePicture: toCloudinaryJson(p.profilePicture),
                banner: toCloudinaryJson(p.banner),
                followersStat: toStatJson(p.followersStat),
                followingStat: toStatJson(p.followingStat),
                spotsFollowingStat: toStatJson(p.spotsFollowingStat),
                mediasStat: toStatJson(p.mediasStat),
                clipsStat: toStatJson(p.clipsStat),
                tricksDoneStat: toStatJson(p.tricksDoneStat),
                createdAt: toDateRequired(p.createdAt),
                updatedAt: toDateRequired(p.updatedAt),
            },
        });

        profileIdMap.set(username, created.id);
    }

    log(`  Inserted ${profileIdMap.size} profiles`);
}

async function migrateSpots(db: Db, prisma: PrismaClient) {
    log('Migrating spots...');
    const spots = await db.collection('spots').find().toArray();
    log(`  Found ${spots.length} spots in MongoDB`);

    let count = 0;

    for (const s of spots) {
        const mongoId = oid(s._id);
        const addedByUsername = String(s.addedBy);
        const addedById = profileIdMap.get(addedByUsername);
        if (!addedById) {
            log(`  WARN: No profile found for spot addedBy "${addedByUsername}" (spot ${mongoId}), skipping`);
            continue;
        }

        await prisma.spot.create({
            data: {
                id: mongoId,
                name: String(s.name),
                streetName: toStr(s.location?.streetName),
                streetNumber: toStr(s.location?.streetNumber),
                city: toStr(s.location?.city),
                country: toStr(s.location?.country),
                longitude: Array.isArray(s.geo) ? (s.geo[0] ?? 0) : 0,
                latitude: Array.isArray(s.geo) ? (s.geo[1] ?? 0) : 0,
                type: spotTypeMap[s.type] ?? 'STREET',
                status: spotStatusMap[s.status] ?? 'ACTIVE',
                description: toStr(s.description),
                indoor: s.indoor ?? false,
                openingHours: Array.isArray(s.openingHours) ? s.openingHours.map(String) : [],
                phone: toStr(s.phone),
                website: toStr(s.website),
                instagram: toStr(s.instagram),
                snapchat: toStr(s.snapchat),
                facebook: toStr(s.facebook),
                addedById,
                coverURL: toStr(s.coverURL),
                tags: Array.isArray(s.tags) ? s.tags.map(String) : [],
                obstacles: mapObstacles(s.obstacles),
                commentsStat: toStatJson(s.commentsStat),
                mediasStat: toStatJson(s.mediasStat),
                clipsStat: toStatJson(s.clipsStat),
                tricksDoneStat: toStatJson(s.tricksDoneStat),
                createdAt: toDateRequired(s.createdAt),
                updatedAt: toDateRequired(s.updatedAt),
            },
        });

        migratedSpotIds.add(mongoId);
        count++;
    }

    log(`  Inserted ${count} spots`);
}

async function migrateSpotEdits(db: Db, prisma: PrismaClient) {
    log('Migrating spot edits...');
    const spots = await db
        .collection('spots')
        .find({ edits: { $exists: true, $not: { $size: 0 } } })
        .toArray();

    let count = 0;

    for (const s of spots) {
        const spotId = oid(s._id);
        if (!spotId || !migratedSpotIds.has(spotId)) continue;

        for (const edit of s.edits ?? []) {
            const addedById = profileIdMap.get(String(edit.addedBy));
            if (!addedById) continue;

            const rawMergeIntoId = edit.mergeInto ? oid(edit.mergeInto) || null : null;
            const mergeIntoId = rawMergeIntoId && migratedSpotIds.has(rawMergeIntoId) ? rawMergeIntoId : null;

            await prisma.spotEdit.create({
                data: {
                    id: oid(edit._id) || createId(),
                    spotId,
                    addedById,
                    name: toStr(edit.name),
                    longitude: edit.longitude != null ? Number(edit.longitude) : null,
                    latitude: edit.latitude != null ? Number(edit.latitude) : null,
                    type: edit.type ? (spotTypeMap[edit.type] ?? null) : null,
                    status: edit.status ? (spotStatusMap[edit.status] ?? null) : null,
                    description: toStr(edit.description),
                    indoor: edit.indoor != null ? Boolean(edit.indoor) : null,
                    phone: toStr(edit.phone),
                    website: toStr(edit.website),
                    instagram: toStr(edit.instagram),
                    snapchat: toStr(edit.snapchat),
                    facebook: toStr(edit.facebook),
                    mergeIntoId,
                    createdAt: toDateRequired(edit.createdAt),
                    updatedAt: toDateRequired(edit.updatedAt),
                },
            });
            count++;
        }
    }

    log(`  Inserted ${count} spot edits`);
}

async function migrateMedia(db: Db, prisma: PrismaClient) {
    log('Migrating media...');
    const medias = await db.collection('media').find().toArray();
    log(`  Found ${medias.length} media in MongoDB`);

    let count = 0;

    for (const m of medias) {
        const mongoId = oid(m._id);
        const addedByUsername = String(m.addedBy);
        const addedById = profileIdMap.get(addedByUsername);
        if (!addedById) {
            log(`  WARN: No profile for media addedBy "${addedByUsername}" (media ${mongoId}), skipping`);
            continue;
        }

        const rawSpotId = m.spot ? oid(m.spot) || null : null;
        const spotId = rawSpotId && migratedSpotIds.has(rawSpotId) ? rawSpotId : null;

        // Determine media type — fall back to checking which file exists
        let mediaType: MediaType = mediaTypeMap[m.type] ?? 'IMAGE';
        if (!m.type) {
            if (m.video && m.video.url) mediaType = 'VIDEO';
            else mediaType = 'IMAGE';
        }

        await prisma.media.create({
            data: {
                id: mongoId,
                type: mediaType,
                caption: toStr(m._caption),
                spotId,
                addedById,
                image: toCloudinaryJson(m.image),
                video: toCloudinaryJson(m.video),
                staffPicked: m.staffPicked ?? false,
                releaseDate: toDate(m.releaseDate),
                hashtags: Array.isArray(m.hashtags) ? m.hashtags.map(String) : [],
                usertags: Array.isArray(m.usertags) ? m.usertags.map(String) : [],
                trickDone: m.trickDone ? (m.trickDone as Prisma.InputJsonValue) : Prisma.JsonNull,
                likesStat: toStatJson(m.likesStat),
                commentsStat: toStatJson(m.commentsStat),
                createdAt: toDateRequired(m.createdAt),
                updatedAt: toDateRequired(m.updatedAt),
            },
        });

        migratedMediaIds.add(mongoId);
        count++;
    }

    log(`  Inserted ${count} media`);
}

async function migrateClips(db: Db, prisma: PrismaClient) {
    log('Migrating clips...');
    const clips = await db.collection('clips').find().toArray();
    log(`  Found ${clips.length} clips in MongoDB`);

    let count = 0;

    for (const c of clips) {
        const mongoId = oid(c._id);
        const addedByUsername = String(c.addedBy);
        const addedById = profileIdMap.get(addedByUsername);
        if (!addedById) {
            log(`  WARN: No profile for clip addedBy "${addedByUsername}" (clip ${mongoId}), skipping`);
            continue;
        }

        const rawSpotId = c.spot ? oid(c.spot) || null : null;
        const spotId = rawSpotId && migratedSpotIds.has(rawSpotId) ? rawSpotId : null;

        await prisma.clip.create({
            data: {
                id: mongoId,
                title: String(c.title),
                description: toStr(c.description),
                provider: clipProviderMap[c.provider] ?? 'YOUTUBE',
                videoURL: String(c.videoURL),
                thumbnailURL: String(c.thumbnailURL),
                spotId,
                addedById,
                likesStat: toStatJson(c.likesStat),
                commentsStat: toStatJson(c.commentsStat),
                createdAt: toDateRequired(c.createdAt),
                updatedAt: toDateRequired(c.updatedAt),
            },
        });

        migratedClipIds.add(mongoId);
        count++;
    }

    log(`  Inserted ${count} clips`);
}

/**
 * Extract embedded comments from Spots, Media, and Clips into the Comment table.
 * Also extracts embedded likes from comments.
 */
async function migrateComments(db: Db, prisma: PrismaClient) {
    log('Migrating comments...');
    let count = 0;

    // --- Spot comments ---
    const spots = await db
        .collection('spots')
        .find({ comments: { $exists: true, $not: { $size: 0 } } })
        .toArray();

    for (const s of spots) {
        const spotId = oid(s._id);
        if (!spotId || !migratedSpotIds.has(spotId)) continue;

        for (const c of s.comments ?? []) {
            const addedById = profileIdMap.get(String(c.addedBy));
            if (!addedById) continue;

            await prisma.comment.create({
                data: {
                    id: oid(c._id) || createId(),
                    content: String(c._content ?? c.content ?? ''),
                    addedById,
                    spotId,
                    hashtags: Array.isArray(c.hashtags) ? c.hashtags.map(String) : [],
                    usertags: Array.isArray(c.usertags) ? c.usertags.map(String) : [],
                    createdAt: toDateRequired(c.createdAt),
                    updatedAt: toDateRequired(c.updatedAt),
                },
            });
            count++;
        }
    }

    // --- Media comments ---
    const medias = await db
        .collection('media')
        .find({ comments: { $exists: true, $not: { $size: 0 } } })
        .toArray();

    for (const m of medias) {
        const mediaId = oid(m._id);
        if (!mediaId || !migratedMediaIds.has(mediaId)) continue;

        for (const c of m.comments ?? []) {
            const addedById = profileIdMap.get(String(c.addedBy));
            if (!addedById) continue;

            await prisma.comment.create({
                data: {
                    id: oid(c._id) || createId(),
                    content: String(c._content ?? c.content ?? ''),
                    addedById,
                    mediaId,
                    hashtags: Array.isArray(c.hashtags) ? c.hashtags.map(String) : [],
                    usertags: Array.isArray(c.usertags) ? c.usertags.map(String) : [],
                    createdAt: toDateRequired(c.createdAt),
                    updatedAt: toDateRequired(c.updatedAt),
                },
            });
            count++;
        }
    }

    // --- Clip comments ---
    const clips = await db
        .collection('clips')
        .find({ comments: { $exists: true, $not: { $size: 0 } } })
        .toArray();

    for (const cl of clips) {
        const clipId = oid(cl._id);
        if (!clipId || !migratedClipIds.has(clipId)) continue;

        for (const c of cl.comments ?? []) {
            const addedById = profileIdMap.get(String(c.addedBy));
            if (!addedById) continue;

            await prisma.comment.create({
                data: {
                    id: oid(c._id) || createId(),
                    content: String(c._content ?? c.content ?? ''),
                    addedById,
                    clipId,
                    hashtags: Array.isArray(c.hashtags) ? c.hashtags.map(String) : [],
                    usertags: Array.isArray(c.usertags) ? c.usertags.map(String) : [],
                    createdAt: toDateRequired(c.createdAt),
                    updatedAt: toDateRequired(c.updatedAt),
                },
            });
            count++;
        }
    }

    log(`  Inserted ${count} comments`);

    // --- Comment likes (nested inside embedded comments) ---
    log('Migrating comment likes...');
    let commentLikeCount = 0;

    const allSources = [
        { collection: 'spots', items: spots },
        { collection: 'media', items: medias },
        { collection: 'clips', items: clips },
    ];

    for (const source of allSources) {
        for (const doc of source.items) {
            for (const c of doc.comments ?? []) {
                const commentId = oid(c._id);
                if (!commentId) continue;

                for (const like of c.likes ?? []) {
                    const addedById = profileIdMap.get(String(like.addedBy));
                    if (!addedById) continue;

                    try {
                        await prisma.like.create({
                            data: {
                                id: oid(like._id) || createId(),
                                addedById,
                                commentId,
                                createdAt: toDateRequired(like.createdAt),
                                updatedAt: toDateRequired(like.updatedAt),
                            },
                        });
                        commentLikeCount++;
                    } catch {
                        // Unique constraint violation — duplicate like, skip
                    }
                }
            }
        }
    }

    log(`  Inserted ${commentLikeCount} comment likes`);
}

/**
 * Extract embedded likes from Media and Clips into the Like table.
 */
async function migrateLikes(db: Db, prisma: PrismaClient) {
    log('Migrating media & clip likes...');
    let count = 0;

    // --- Media likes ---
    const medias = await db
        .collection('media')
        .find({ likes: { $exists: true, $not: { $size: 0 } } })
        .toArray();

    for (const m of medias) {
        const mediaId = oid(m._id);
        if (!mediaId || !migratedMediaIds.has(mediaId)) continue;

        for (const like of m.likes ?? []) {
            const addedById = profileIdMap.get(String(like.addedBy));
            if (!addedById) continue;

            try {
                await prisma.like.create({
                    data: {
                        id: oid(like._id) || createId(),
                        addedById,
                        mediaId,
                        createdAt: toDateRequired(like.createdAt),
                        updatedAt: toDateRequired(like.updatedAt),
                    },
                });
                count++;
            } catch {
                // Unique constraint violation — duplicate like, skip
            }
        }
    }

    // --- Clip likes ---
    const clips = await db
        .collection('clips')
        .find({ likes: { $exists: true, $not: { $size: 0 } } })
        .toArray();

    for (const cl of clips) {
        const clipId = oid(cl._id);
        if (!clipId || !migratedClipIds.has(clipId)) continue;

        for (const like of cl.likes ?? []) {
            const addedById = profileIdMap.get(String(like.addedBy));
            if (!addedById) continue;

            try {
                await prisma.like.create({
                    data: {
                        id: oid(like._id) || createId(),
                        addedById,
                        clipId,
                        createdAt: toDateRequired(like.createdAt),
                        updatedAt: toDateRequired(like.updatedAt),
                    },
                });
                count++;
            } catch {
                // Unique constraint violation — duplicate like, skip
            }
        }
    }

    log(`  Inserted ${count} media & clip likes`);
}

async function migrateProfileFollows(db: Db, prisma: PrismaClient) {
    log('Migrating profile follows...');
    const profiles = await db.collection('profiles').find().toArray();
    let count = 0;

    for (const p of profiles) {
        const followerId = profileIdMap.get(String(p._id));
        if (!followerId) continue;

        // `following` is the list of profile usernames this profile follows
        for (const followingUsername of p.following ?? []) {
            const followingId = profileIdMap.get(String(followingUsername));
            if (!followingId) continue;

            try {
                await prisma.profileFollow.create({
                    data: {
                        followerId,
                        followingId,
                    },
                });
                count++;
            } catch {
                // Duplicate, skip
            }
        }
    }

    log(`  Inserted ${count} profile follows`);
}

async function migrateProfileSpotFollows(db: Db, prisma: PrismaClient) {
    log('Migrating profile spot follows...');
    const profiles = await db.collection('profiles').find().toArray();
    let count = 0;

    for (const p of profiles) {
        const profileId = profileIdMap.get(String(p._id));
        if (!profileId) continue;

        for (const spotRef of p.spotsFollowing ?? []) {
            const spotId = oid(spotRef);
            if (!spotId) continue;

            try {
                await prisma.profileSpotFollow.create({
                    data: {
                        profileId,
                        spotId,
                    },
                });
                count++;
            } catch {
                // Duplicate, skip
            }
        }
    }

    log(`  Inserted ${count} profile spot follows`);
}

async function migrateRewards(db: Db, prisma: PrismaClient) {
    log('Migrating rewards...');
    const profiles = await db
        .collection('profiles')
        .find({ rewards: { $exists: true, $not: { $size: 0 } } })
        .toArray();

    let count = 0;

    for (const p of profiles) {
        const profileId = profileIdMap.get(String(p._id));
        if (!profileId) continue;

        for (const r of p.rewards ?? []) {
            if (!r.type || !r.subtype) continue;

            await prisma.reward.create({
                data: {
                    id: oid(r._id) || createId(),
                    profileId,
                    type: String(r.type),
                    subtype: String(r.subtype),
                    createdAt: toDateRequired(r.createdAt),
                    updatedAt: toDateRequired(r.updatedAt),
                },
            });
            count++;
        }
    }

    log(`  Inserted ${count} rewards`);
}

// ---------------------------------------------------------------------------
// Wipe PostgreSQL tables (in FK-safe order)
// ---------------------------------------------------------------------------

async function wipeTables(prisma: PrismaClient) {
    log('Wiping PostgreSQL tables...');

    // Delete in reverse dependency order
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.reward.deleteMany();
    await prisma.profileSpotFollow.deleteMany();
    await prisma.profileFollow.deleteMany();
    await prisma.spotEdit.deleteMany();
    await prisma.clip.deleteMany();
    await prisma.media.deleteMany();
    await prisma.spot.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    log('  All tables wiped');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    log('=== MongoDB → PostgreSQL Migration ===');
    log(`MongoDB URI: ${MONGODB_URI}`);
    log(`PostgreSQL: using DATABASE_URL from environment`);
    log('');

    const mongoClient = new MongoClient(MONGODB_URI);
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });

    try {
        await mongoClient.connect();
        const db = mongoClient.db();
        log(`Connected to MongoDB database: ${db.databaseName}`);

        await prisma.$connect();
        log('Connected to PostgreSQL via Prisma');
        log('');

        // Wipe target tables
        await wipeTables(prisma);
        log('');

        // Migrate in dependency order
        // 1. Users first (no dependencies)
        await migrateUsers(db, prisma);

        // 2. Accounts — credential provider with password (depend on User)
        await migrateAccounts(db, prisma);

        // 3. Profiles (depend on User)
        await migrateProfiles(db, prisma);

        // 4. Spots (depend on Profile)
        await migrateSpots(db, prisma);
        await migrateSpotEdits(db, prisma);

        // 5. Media & Clips (depend on Profile + Spot)
        await migrateMedia(db, prisma);
        await migrateClips(db, prisma);

        // 6. Comments (depend on Profile + Spot/Media/Clip)
        //    Also handles nested comment likes
        await migrateComments(db, prisma);

        // 7. Likes on Media & Clips (depend on Profile + Media/Clip)
        await migrateLikes(db, prisma);

        // 8. Join tables (depend on Profile + Spot)
        await migrateProfileFollows(db, prisma);
        await migrateProfileSpotFollows(db, prisma);

        // 9. Rewards (depend on Profile)
        await migrateRewards(db, prisma);

        log('');
        log('=== Migration complete ===');
        log(`  Users:              ${userIdMap.size}`);
        log(`  Profiles:           ${profileIdMap.size}`);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        await mongoClient.close();
    }
}

main();
