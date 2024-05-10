import cloudinary from 'cloudinary';
import httpStatus from 'http-status';

import BufferStream from './buffer-stream';
import config from '../server/config';
import logger from '../server/logger';
import APIError from '../helpers/api-error';
import CloudinaryFile from '../models/cloudinary-file';

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_SECRET_KEY,
});

const DEFAULT_WIDTH = 1080;
const MAX_IMAGE_SIZE = 20;
const MAX_VIDEO_SIZE = 100;
const MB_IN_BYTES = 1000000;

function getFakeCloudinaryFile(preset) {
    if (preset.folder === 'profiles') {
        return new CloudinaryFile({
            publicId: 'assets/profile_pic',
            version: '1526361113',
            url: 'https://res.cloudinary.com/krak-dev/image/upload/v1526361113/assets/profile_pic.webp',
            format: 'webp',
            width: 1080,
            height: 1340,
        });
    }
    if (preset.folder === 'banners') {
        return new CloudinaryFile({
            publicId: 'assets/profile_banner',
            version: '1526361113',
            url: 'https://res.cloudinary.com/krak-dev/image/upload/v1526361113/assets/profile_banner.webp',
            format: 'webp',
            width: 1080,
            height: 1080,
        });
    }

    if (preset.resource_type === 'image') {
        return new CloudinaryFile({
            publicId: 'assets/media_pic',
            version: '1526361112',
            url: 'https://res.cloudinary.com/krak-dev/image/upload/v1526361112/assets/media_pic.webp',
            format: 'webp',
            width: 1080,
            height: 1051,
        });
    }

    return new CloudinaryFile({
        publicId: 'assets/media_vid',
        version: '1526361117',
        url: 'https://res.cloudinary.com/krak-dev/video/upload/v1526361117/assets/media_vid.mp4',
        format: 'mp4',
        width: 1080,
        height: 606,
    });
}

/**
 * Upload a file to cloudinary
 * @param {File} file - multi-part file to be uploaded
 * @param {string} folder - Cloudinary folder name
 * @param {CloudinaryFile} [cloudinaryFile] - CloudinaryFile to replace existing ressource
 * @param {Object} [opts] - Upload options
 * @return {Promise<CloudinaryFile>}
 */
function upload(file, folder, cloudinaryFile, opts = {}) {
    return new Promise((resolve, reject) => {
        const stream = new BufferStream(file.buffer);

        const preset = {
            folder,
            resource_type: file.mimetype.split('/')[0],
        };

        if (preset.resource_type !== 'image' && preset.resource_type !== 'video') {
            return reject(new APIError(['Bad kind of file: %s', preset.resource_type], httpStatus.BAD_REQUEST));
        }

        if (preset.resource_type === 'image') {
            if (file.size > MAX_IMAGE_SIZE * MB_IN_BYTES) {
                return reject(new APIError(['Maximum picture size is %sMB', MAX_IMAGE_SIZE], httpStatus.BAD_REQUEST));
            }
            preset.format = 'webp';
            preset.quality = 'auto';
        }
        if (preset.resource_type === 'video') {
            if (file.size > MAX_VIDEO_SIZE * MB_IN_BYTES) {
                return reject(new APIError(['Maximum video size is %sMB', MAX_VIDEO_SIZE], httpStatus.BAD_REQUEST));
            }
            preset.format = 'mp4';
            preset.video_codec = 'auto';
            if (opts.trimStart) {
                preset.start_offset = opts.trimStart;
            }
            if (opts.trimEnd) {
                preset.end_offset = opts.trimEnd;
            }
        }

        if (!opts.width && !opts.height) {
            preset.width = DEFAULT_WIDTH;
        } else {
            if (opts.width) {
                preset.width = opts.width;
            }
            if (opts.height) {
                preset.height = opts.height;
            }
            if (opts.cropX && opts.cropY) {
                preset.x = opts.cropX;
                preset.y = opts.cropY;
            }
        }

        if (preset.width && preset.height && preset.x && preset.y) {
            preset.crop = 'crop';
        } else if (preset.width && preset.height) {
            preset.crop = 'fill';
        } else {
            preset.crop = 'scale';
        }

        if (cloudinaryFile && cloudinaryFile.publicId) {
            const ids = cloudinaryFile.publicId.split('/');
            preset.public_id = ids[ids.length - 1];
            preset.invalidate = true;
        }

        logger.debug('Cloudinary presets', preset);

        if (config.NODE_ENV !== 'development' && config.NODE_ENV !== 'test') {
            return stream.pipe(
                cloudinary.uploader.upload_stream((result) => {
                    if (result) {
                        logger.debug('Cloudinary upload result', result);
                        return resolve(
                            new CloudinaryFile({
                                publicId: result.public_id,
                                version: result.version,
                                url: result.secure_url,
                                format: result.format,
                                width: result.width,
                                height: result.height,
                            }),
                        );
                    }
                    return reject(new APIError(['Error while upload ressource'], httpStatus.INTERNAL_SERVER_ERROR));
                }, preset),
            );
        }
        return resolve(getFakeCloudinaryFile(preset));
    });
}

/**
 * Delete Cloudinary ressource
 * @param {CloudinaryFile} cloudinaryFile - CloudinaryFile to destroy
 * @returns {Promise<CloudinaryFile>}
 */
function destroy(cloudinaryFile) {
    return new Promise((resolve, reject) => {
        if (
            cloudinaryFile &&
            cloudinaryFile.publicId &&
            config.NODE_ENV !== 'development' &&
            config.NODE_ENV !== 'test'
        ) {
            const preset = {};
            if (cloudinaryFile.url && cloudinaryFile.url.includes('video')) {
                preset.resource_type = 'video';
            }
            cloudinary.uploader.destroy(
                cloudinaryFile.publicId,
                (result) => {
                    if (result) {
                        resolve(cloudinaryFile);
                    } else {
                        reject(new APIError(['Error while delete ressource'], httpStatus.INTERNAL_SERVER_ERROR));
                    }
                },
                preset,
            );
        } else {
            resolve(cloudinaryFile);
        }
    });
}

export default { upload, destroy };
