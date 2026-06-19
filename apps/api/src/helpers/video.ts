import { execFile } from 'child_process';
import { randomUUID } from 'crypto';
import { mkdtemp, readFile, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// ponytail: system ffmpeg on PATH (apt-get in Docker, brew locally).
const FFMPEG = 'ffmpeg';

// ponytail: matches old Cloudinary behaviour (scale to 1080px wide).
const TARGET_WIDTH = 1080;
const MAX_VIDEO_SIZE = 100 * 1_000_000; // 100 MB

export type ProcessedVideo = {
    mp4Buffer: Buffer;
    width: number;
    height: number;
    thumbBuffer: Buffer;
    thumbWidth: number;
    thumbHeight: number;
};

/**
 * Transcode an uploaded video to a browser-friendly H.264/AAC MP4 (scaled to
 * 1080px wide) and extract the first frame as a WebP poster thumbnail.
 *
 * Uses the FFmpeg binary bundled with node-av via execFile + temp files —
 * normalizes any input (incl. iPhone HEVC .mov) to H.264. ffmpeg detects the
 * input container itself, so the source mime type isn't needed.
 */
export async function processVideo(buffer: Buffer): Promise<ProcessedVideo> {
    if (buffer.byteLength > MAX_VIDEO_SIZE) {
        throw new Error('Video exceeds maximum size of 100 MB');
    }

    const dir = await mkdtemp(path.join(os.tmpdir(), 'krak-video-'));
    const inPath = path.join(dir, `in-${randomUUID()}`);
    const mp4Path = path.join(dir, 'out.mp4');
    const framePath = path.join(dir, 'frame.png');

    try {
        await Bun.write(inPath, buffer);

        // even dims required by libx264 (-2 keeps aspect ratio).
        const scale = `scale=${TARGET_WIDTH}:-2`;

        await execFileAsync(FFMPEG, [
            '-i',
            inPath,
            '-vf',
            scale,
            '-c:v',
            'libx264',
            '-preset',
            'medium',
            '-crf',
            '23',
            '-pix_fmt',
            'yuv420p',
            '-movflags',
            '+faststart',
            '-c:a',
            'aac',
            '-b:a',
            '128k',
            '-y',
            mp4Path,
        ]);

        // First frame for the poster thumbnail.
        await execFileAsync(FFMPEG, [
            '-i',
            mp4Path,
            '-vf',
            `${scale},select=eq(n\\,0)`,
            '-frames:v',
            '1',
            '-y',
            framePath,
        ]);

        const mp4Buffer = await readFile(mp4Path);
        const frameBuffer = await readFile(framePath);

        const { default: sharp } = await import('sharp');
        const { data: thumbBuffer, info } = await sharp(frameBuffer).webp().toBuffer({ resolveWithObject: true });

        return {
            mp4Buffer,
            width: info.width ?? 0,
            height: info.height ?? 0,
            thumbBuffer,
            thumbWidth: info.width ?? 0,
            thumbHeight: info.height ?? 0,
        };
    } finally {
        await rm(dir, { recursive: true, force: true });
    }
}
