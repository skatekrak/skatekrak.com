import { MongoClient, ObjectId, type Document } from 'mongodb';

import { Prisma, type Obstacle, type PrismaClient, type SpotStatus, type SpotType } from '@krak/prisma';

import { env } from '../env';
import { runJob } from '../lib/runJob';

const dryRun = process.argv.includes('--dry-run');
const spotIdArg = process.argv.find((arg) => arg.startsWith('--spot-id='))?.slice('--spot-id='.length);

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

function toId(value: unknown): string {
    if (value instanceof ObjectId) return value.toHexString();
    return String(value ?? '');
}

function spotId(spot: Document): string {
    return toId(spot.id ?? spot['_id']);
}

function toDate(value: unknown): Date | undefined {
    if (!value) return undefined;
    const date = new Date(value as string | number | Date);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function toStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(String) : [];
}

function toObstacleArray(value: unknown): Obstacle[] {
    return toStringArray(value)
        .map((obstacle) => obstacleMap[obstacle] ?? null)
        .filter((obstacle): obstacle is Obstacle => obstacle !== null);
}

function toStatJson(stat: Document | undefined): Prisma.InputJsonValue | typeof Prisma.JsonNull {
    if (!stat) return Prisma.JsonNull;

    return {
        all: stat.all ?? 0,
        monthly: stat.monthly ?? 0,
        weekly: stat.weekly ?? 0,
        daily: stat.daily ?? 0,
        createdAt: toDate(stat.createdAt)?.toISOString() ?? null,
    };
}

async function findExistingProfileIds(prisma: PrismaClient, ids: string[]): Promise<Set<string>> {
    const profiles = await prisma.profile.findMany({
        where: { id: { in: ids } },
        select: { id: true },
    });

    return new Set(profiles.map((profile) => profile.id));
}

async function findProfileIdsByUsername(prisma: PrismaClient, usernames: string[]): Promise<Map<string, string>> {
    const profiles = await prisma.profile.findMany({
        where: { user: { username: { in: usernames } } },
        select: { id: true, user: { select: { username: true } } },
    });

    return new Map(profiles.map((profile) => [profile.user.username, profile.id]));
}

function toSpotCreateInput(
    spot: Document,
    profileIdsByUsername: Map<string, string>,
): Prisma.SpotCreateManyInput | null {
    const id = spotId(spot);
    const addedById =
        typeof spot.addedById === 'string' ? spot.addedById : profileIdsByUsername.get(String(spot.addedBy));
    const type = typeof spot.type === 'string' ? spotTypeMap[spot.type.toLowerCase()] : null;
    const status = typeof spot.status === 'string' ? spotStatusMap[spot.status.toLowerCase()] : null;

    if (!id || !addedById || typeof spot.name !== 'string' || !type) return null;

    return {
        id,
        name: spot.name,
        streetName: typeof spot.streetName === 'string' ? spot.streetName : (spot.location?.streetName ?? null),
        streetNumber: typeof spot.streetNumber === 'string' ? spot.streetNumber : (spot.location?.streetNumber ?? null),
        city: typeof spot.city === 'string' ? spot.city : (spot.location?.city ?? null),
        country: typeof spot.country === 'string' ? spot.country : (spot.location?.country ?? null),
        longitude: typeof spot.longitude === 'number' ? spot.longitude : (spot.geo?.[0] ?? 0),
        latitude: typeof spot.latitude === 'number' ? spot.latitude : (spot.geo?.[1] ?? 0),
        type,
        status: status ?? 'ACTIVE',
        description: typeof spot.description === 'string' ? spot.description : null,
        indoor: typeof spot.indoor === 'boolean' ? spot.indoor : false,
        openingHours: toStringArray(spot.openingHours),
        phone: typeof spot.phone === 'string' ? spot.phone : null,
        website: typeof spot.website === 'string' ? spot.website : null,
        instagram: typeof spot.instagram === 'string' ? spot.instagram : null,
        snapchat: typeof spot.snapchat === 'string' ? spot.snapchat : null,
        facebook: typeof spot.facebook === 'string' ? spot.facebook : null,
        addedById,
        coverURL: typeof spot.coverURL === 'string' ? spot.coverURL : null,
        tags: toStringArray(spot.tags),
        obstacles: toObstacleArray(spot.obstacles),
        commentsStat: toStatJson(spot.commentsStat),
        mediasStat: toStatJson(spot.mediasStat),
        clipsStat: toStatJson(spot.clipsStat),
        tricksDoneStat: toStatJson(spot.tricksDoneStat),
        createdAt: toDate(spot.createdAt),
        updatedAt: toDate(spot.updatedAt),
    };
}

runJob('add-missing-spots', async ({ prisma }) => {
    const mongo = new MongoClient(env.MONGODB_URL);

    try {
        await mongo.connect();
        const mongoDb = mongo.db(env.MONGODB_DATABASE);
        const mongoSpots = await mongoDb.collection('spots').find().toArray();
        const [{ database, schema }] = await prisma.$queryRaw<
            [{ database: string; schema: string }]
        >`select current_database() as database, current_schema() as schema`;
        const existingSpotIds = new Set((await prisma.spot.findMany({ select: { id: true } })).map((spot) => spot.id));
        const profileIdsByUsername = await findProfileIdsByUsername(prisma, [
            ...new Set(mongoSpots.flatMap((spot) => (typeof spot.addedBy === 'string' ? [spot.addedBy] : []))),
        ]);

        const missingSpots = mongoSpots
            .filter((spot) => !existingSpotIds.has(spotId(spot)))
            .map((spot) => toSpotCreateInput(spot, profileIdsByUsername))
            .filter((spot): spot is Prisma.SpotCreateManyInput => spot !== null);
        const existingProfileIds = await findExistingProfileIds(prisma, [
            ...new Set(missingSpots.map((spot) => spot.addedById)),
        ]);
        const data = missingSpots.filter((spot) => existingProfileIds.has(spot.addedById));

        console.log(`Found ${mongoSpots.length} Mongo spot(s) in ${env.MONGODB_DATABASE}.spots.`);
        console.log(`Found ${existingSpotIds.size} Postgres spot(s) in ${database}.${schema}.spots.`);
        console.log(`Found ${missingSpots.length} missing spot(s), ${data.length} with an existing profile.`);

        if (spotIdArg) {
            const mongoSpot = mongoSpots.find((spot) => spotId(spot) === spotIdArg);
            console.log(
                `Spot ${spotIdArg}: mongo=${mongoSpot ? 'yes' : 'no'}, postgres=${existingSpotIds.has(spotIdArg) ? 'yes' : 'no'}.`,
            );
        }

        if (dryRun) {
            console.log('Dry run: no spots created.');
            return;
        }

        if (data.length === 0) return;

        const result = await prisma.spot.createMany({ data, skipDuplicates: true });
        console.log(`Created ${result.count} spot(s).`);
    } finally {
        await mongo.close();
    }
});
