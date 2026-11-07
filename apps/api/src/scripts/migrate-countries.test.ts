import { expect, test } from 'bun:test';

import type { Country } from '@krak/contracts';

import { metadataSchema } from './migrate-countries';

const france: Pick<Country, 'id' | 'code' | 'bounds'> = {
    id: 'france',
    code: 'FR',
    bounds: [
        [-5.2, 41.3],
        [9.7, 51.2],
    ],
};

test('country migrations require valid explicit zones and unique IDs and codes', () => {
    expect(metadataSchema.parse([france])).toEqual([france]);
    expect(metadataSchema.safeParse([{ id: 'france', code: 'FR' }]).success).toBe(false);
    expect(metadataSchema.safeParse([france, { ...france, code: 'BE' }]).success).toBe(false);
    expect(metadataSchema.safeParse([france, { ...france, id: 'belgium' }]).success).toBe(false);
    expect(
        metadataSchema.safeParse([
            {
                ...france,
                bounds: [
                    [-200, 41.3],
                    [9.7, 51.2],
                ],
            },
        ]).success,
    ).toBe(false);
});
