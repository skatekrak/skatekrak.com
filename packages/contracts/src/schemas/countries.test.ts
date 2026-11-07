import { describe, expect, test } from 'bun:test';

import { createCountryInput, updateCountryInput, type Country } from './countries';

const country: Country = {
    id: 'france',
    code: 'FR',
    name: 'France',
    subtitle: '',
    edito: '',
    about: '',
    videos: ['https://www.youtube.com/watch?v=test'],
    soundtrack: ['Artist - Track'],
    bounds: [
        [-5.2, 41.3],
        [9.7, 51.2],
    ],
    hidden: false,
};

describe('country validation', () => {
    test('accepts editorial destinations and opposite corners in either order', () => {
        expect(createCountryInput.parse(country)).toEqual(country);
        expect(
            createCountryInput.safeParse({
                ...country,
                bounds: [
                    [-180, -85.051129],
                    [180, 85.051129],
                ],
            }).success,
        ).toBe(true);
        expect(createCountryInput.safeParse({ ...country, bounds: [...country.bounds].toReversed() }).success).toBe(
            true,
        );
        expect(
            createCountryInput.safeParse({
                ...country,
                bounds: [
                    [178, -20],
                    [182, -12],
                ],
            }).success,
        ).toBe(true);
    });

    test('rejects invalid identity, missing or degenerate zones, and unsafe video URLs', () => {
        for (const invalid of [
            { id: '../france' },
            { code: 'France' },
            { code: 'fr' },
            { name: ' ' },
            { bounds: undefined },
            { bounds: [] },
            {
                bounds: [
                    [181, 0],
                    [182, 10],
                ],
            },
            {
                bounds: [
                    [-180, 0],
                    [181, 10],
                ],
            },
            {
                bounds: [
                    [0, 0],
                    [0, 0],
                ],
            },
            {
                bounds: [
                    [0, 0],
                    [0, 10],
                ],
            },
            {
                bounds: [
                    [0, 0],
                    [10, 0],
                ],
            },
            {
                bounds: [
                    [0, 0],
                    [541, 10],
                ],
            },
            {
                bounds: [
                    [0, 0],
                    [10, 90],
                ],
            },
            {
                bounds: [
                    [NaN, 0],
                    [10, 10],
                ],
            },
            {
                bounds: [
                    [0, 0],
                    [10, Infinity],
                ],
            },
            { videos: ['javascript:alert(1)'] },
            { soundtrack: [' '] },
        ]) {
            expect(createCountryInput.safeParse({ ...country, ...invalid }).success).toBe(false);
        }
    });

    test('partial updates do not reset editorial content or visibility', () => {
        expect(updateCountryInput.parse({ id: country.id, bounds: country.bounds })).toEqual({
            id: country.id,
            bounds: country.bounds,
        });
        expect(
            updateCountryInput.safeParse({
                id: country.id,
                bounds: [
                    [0, 0],
                    [541, 10],
                ],
            }).success,
        ).toBe(false);
    });
});
