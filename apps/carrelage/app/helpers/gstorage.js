import Storage from '@google-cloud/storage';

import BufferStream from './buffer-stream';
import config from '../server/config';
import logger from '../server/logger';

const storage = new Storage();
const bucket = storage.bucket(config.GCLOUD_STORAGE_BUCKET);

function isBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
}

function getFakeGCSUrl(folder) {
    if (folder === 'contests') {
        return 'https://cdn.skatekrak.com/app-staging/dev/contest.jpg';
    } else if (folder === 'sessions') {
        return 'https://cdn.skatekrak.com/app-staging/dev/session.png';
    } else if (folder === 'spots') {
        return 'https://cdn.skatekrak.com/app-staging/dev/spot.png';
    }
    return 'https://cdn.skatekrak.com/app-staging/dev/trick.jpg';
}

/**
 * Upload Stream or Buffer to GCloud Storage
 * @param {Buffer|Stream} file - File represented by either a Buffer or a Stream
 * @param {String} folder - Folder where the file is going to be uploaded
 * @param {String} filename - Name of the file
 * @return {Promise<string, error>}
 */
function uploadToGCloud(file, folder, filename) {
    return new Promise((resolve, reject) => {
        logger.debug('uploadToGCloud called', folder, filename);
        let stream = file;
        if (file && isBuffer(file)) {
            logger.debug('This is a Buffer');
            stream = new BufferStream(file);
        }
        if (config.NODE_ENV !== 'development') {
            const path = `${config.GCLOUD_STORAGE_FOLDER}/${folder}/${filename}`;
            const uploader = bucket.file(path);
            stream
                .pipe(uploader.createWriteStream())
                .on('error', (err) => reject(err))
                .on('finish', () => resolve(`${config.GCLOUD_CDN_URL}/${path}`));
        } else {
            resolve(getFakeGCSUrl(folder));
        }
    });
}

/**
 * Delete object from GCloud Storage
 * @param {String} folder - Folder where the file is
 * @param {String} filename - Name of the file to be deleted
 * @return {Promise<string, error>}
 */
function deleteFromGCloud(folder, filename) {
    logger.debug('deleteFromGCloud called', folder, filename);
    const path = `${config.GCLOUD_STORAGE_FOLDER}/${folder}/${filename}`;
    if (config.NODE_ENV !== 'development') {
        return bucket.file(path).delete();
    }

    return Promise.resolve();
}

export default { uploadToGCloud, deleteFromGCloud };
