import { describe, expect, test } from 'bun:test';

import { deleteSpotAssociatedDataLabels, isSpotDeleteConfirmationValid } from './spot-delete-confirmation';

describe('spot delete confirmation', () => {
    test('requires the exact spot name', () => {
        expect(isSpotDeleteConfirmationValid('MACBA', 'MACBA')).toBe(true);
        expect(isSpotDeleteConfirmationValid('macba', 'MACBA')).toBe(false);
        expect(isSpotDeleteConfirmationValid(' MACBA ', 'MACBA')).toBe(false);
    });

    test('lists associated data affected by deleting a spot', () => {
        expect(deleteSpotAssociatedDataLabels).toEqual([
            'spot comments',
            'spot edit history',
            'followers and saved spot links',
            'likes attached directly to the spot',
            'media and clips will be detached from the spot',
        ]);
    });
});
