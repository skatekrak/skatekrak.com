import { expect, test } from 'bun:test';

const environment = {
    DATABASE_URL: 'postgresql://test:test@127.0.0.1:1/test',
    MEILI_HOST: 'http://127.0.0.1:1',
    MEILI_ADMIN_KEY: 'test',
    DO_CDN_ENDPOINT: 'https://cdn.example.test',
};

test('the shared job runner loads without MongoDB configuration', () => {
    for (const url of [undefined, '']) {
        const result = Bun.spawnSync(
            [
                process.execPath,
                '--eval',
                `import { env } from ${JSON.stringify(new URL('./env.ts', import.meta.url).href)};
                 await import(${JSON.stringify(new URL('./lib/runJob.ts', import.meta.url).href)});
                 console.log(JSON.stringify({ mongoUrl: env.MONGODB_URL ?? null, database: env.MONGODB_DATABASE }));`,
            ],
            { env: { ...environment, MONGODB_URL: url } },
        );
        expect(result.stderr.toString()).toBe('');
        expect(result.exitCode).toBe(0);
        expect(JSON.parse(result.stdout.toString())).toEqual({ mongoUrl: null, database: 'carrelage' });
    }
});

test('MongoDB-backed jobs reject a missing URL before querying either database', () => {
    for (const job of ['add-missing-spots', 'check-missing-media-images', 'link-missing-spot-media']) {
        const result = Bun.spawnSync([process.execPath, new URL(`./jobs/${job}.ts`, import.meta.url).pathname], {
            env: environment,
        });
        expect(result.exitCode).toBe(1);
        expect(result.stderr.toString()).toContain('MONGODB_URL is required for this job.');
        expect(result.stdout.toString()).not.toContain('done in');
    }
});
