import { runJob } from '../lib/runJob';

const dryRun = process.argv.includes('--dry-run');

/**
 * Creates a Profile for every User that does not have one yet.
 * Profile <-> User is a 1:1 relation (Profile.userId is unique), so we
 * simply select users whose `profile` relation is null and create the
 * missing rows in batches.
 */
runJob('add-missing-profiles', async ({ prisma }) => {
    const usersWithoutProfile = await prisma.user.findMany({
        where: { profile: { is: null } },
        select: { id: true, username: true },
    });

    console.log(`Found ${usersWithoutProfile.length} user(s) without a profile.`);

    if (dryRun) {
        console.log('Dry run: no profiles created.');
        return;
    }

    if (usersWithoutProfile.length === 0) {
        return;
    }

    const result = await prisma.profile.createMany({
        data: usersWithoutProfile.map((user) => ({ userId: user.id })),
        skipDuplicates: true,
    });

    console.log(`Created ${result.count} profile(s).`);
});
