import { describe, expect, test } from 'bun:test';

import { uploadSelectedMediaFiles, type SelectedMediaFile } from './add-media-dialog.helpers';

function selectedFile(id: string, file: File): SelectedMediaFile {
    return { id, file, preview: null };
}

describe('uploadSelectedMediaFiles', () => {
    test('continues after a failed upload and shares metadata with every file', async () => {
        const releaseDate = new Date('2026-06-01T00:00:00.000Z');
        const files = [
            selectedFile('image-1', new File(['one'], 'one.png', { type: 'image/png' })),
            selectedFile('video-1', new File(['two'], 'two.mp4', { type: 'video/mp4' })),
            selectedFile('image-2', new File(['three'], 'three.webp', { type: 'image/webp' })),
        ];
        const progress: number[] = [];
        const attempted: string[] = [];

        const result = await uploadSelectedMediaFiles({
            files,
            values: {
                caption: 'Shared caption',
                spotId: 'spot-123',
                releaseDate,
            },
            createMedia: async (input) => {
                attempted.push(input.file.name);
                expect(input.caption).toBe('Shared caption');
                expect(input.spotId).toBe('spot-123');
                expect(input.releaseDate).toBe(releaseDate);

                if (input.file.name === 'two.mp4') {
                    throw new Error('Upload failed for video');
                }
            },
            onProgress: (index) => progress.push(index),
        });

        expect(attempted).toEqual(['one.png', 'two.mp4', 'three.webp']);
        expect(progress).toEqual([1, 2, 3]);
        expect(result).toEqual({
            uploaded: 2,
            failed: [{ id: 'video-1', name: 'two.mp4', message: 'Upload failed for video' }],
        });
    });
});
