import got from 'got';
import queryString from 'query-string';

import config from '../../server/config';
import Profile from '../../models/profile';
import Media from '../../models/media';
import logger from '../../server/logger';

async function getCloudinaryRes(type = 'image', prefix) {
    const map = new Map();
    let result;
    do {
        const query = {
            max_results: 1000,
        };
        if (prefix) {
            query.prefix = prefix;
        }
        if (result && result.body && result.body.next_cursor) {
            query.next_cursor = result.body.next_cursor;
        }
        result = await got.get(
            `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/resources/${type}/upload`,
            {
                auth: `${config.CLOUDINARY_API_KEY}:${config.CLOUDINARY_SECRET_KEY}`,
                query,
                json: true,
            },
        );
        result.body.resources.forEach((element) => map.set(element.public_id, element));
    } while (result.body.next_cursor);
    return map;
}

async function deleteCloudinaryRes(type = 'image', ids = []) {
    let start = 0;
    let end = 100;
    let deleted = 0;
    while (start < ids.length) {
        const query = queryString.stringify({ public_ids: ids.slice(start, end) }, { arrayFormat: 'bracket' });
        const res = await got.delete(
            `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/resources/${type}/upload`,
            {
                auth: `${config.CLOUDINARY_API_KEY}:${config.CLOUDINARY_SECRET_KEY}`,
                query,
                json: true,
            },
        );
        deleted += Object.keys(res.body.deleted).length;
        start += 100;
        end += 100;
    }
    return deleted;
}

export default async function apply(params) {
    const { safe } = params;

    const assets = await getCloudinaryRes('image', 'assets/');
    const allPictures = await getCloudinaryRes('image');
    const allVideos = await getCloudinaryRes('video');

    assets.forEach((val, key) => {
        allPictures.delete(key);
    });

    const json = {
        safe,
        pic: {
            countInDBWithCloudinary: 0,
            countMissingInCloudinary: 0,
        },
        banner: {
            countInDBWithCloudinary: 0,
            countMissingInCloudinary: 0,
        },
        image: {
            countInDBWithCloudinary: 0,
            countMissingInCloudinary: 0,
        },
        video: {
            countInDBWithCloudinary: 0,
            countMissingInCloudinary: 0,
        },
        countPicturesInCloudinary: allPictures.size,
        countVideosInCloudinary: allVideos.size,
        cleanablePicturesInMB: 0,
        cleanableVideosInMB: 0,
        deletedPictures: 0,
        deletedVideos: 0,
    };
    const missing = [];

    const findAll = Profile.find().cursor();
    for (let profile = await findAll.next(); profile !== null; profile = await findAll.next()) {
        if (profile.profilePicture) {
            json.pic.countInDBWithCloudinary += 1;
            if (allPictures.has(profile.profilePicture.publicId)) {
                allPictures.delete(profile.profilePicture.publicId);
            } else {
                json.pic.countMissingInCloudinary += 1;
                missing.push(profile.pic);
            }
        }
        if (profile.banner) {
            json.banner.countInDBWithCloudinary += 1;
            if (allPictures.has(profile.banner.publicId)) {
                allPictures.delete(profile.banner.publicId);
            } else {
                json.banner.countMissingInCloudinary += 1;
                missing.push(profile.banner);
            }
        }
    }

    const findMedias = Media.find().cursor();
    for (let media = await findMedias.next(); media !== null; media = await findMedias.next()) {
        if (media.video) {
            json.video.countInDBWithCloudinary += 1;
            if (allVideos.has(media.video.publicId)) {
                allVideos.delete(media.video.publicId);
            } else {
                json.video.countMissingInCloudinary += 1;
                missing.push(media.video);
            }
        } else if (media.image) {
            json.image.countInDBWithCloudinary += 1;
            if (allPictures.has(media.image.publicId)) {
                allPictures.delete(media.image.publicId);
            } else {
                json.image.countMissingInCloudinary += 1;
                missing.push(media.image);
            }
        }
    }

    allPictures.forEach((p) => {
        json.cleanablePicturesInMB += p.bytes;
    });

    allVideos.forEach((v) => {
        json.cleanableVideosInMB += v.bytes;
    });

    json.cleanablePicturesInMB = `${(json.cleanablePicturesInMB / 1000 / 1000).toFixed(2)} MB`;
    json.cleanableVideosInMB = `${(json.cleanableVideosInMB / 1000 / 1000).toFixed(2)} MB`;

    if (!safe) {
        json.deletedPictures += await deleteCloudinaryRes('image', [...allPictures.keys()]);
        json.deletedVideos += await deleteCloudinaryRes('video', [...allVideos.keys()]);
    }

    logger.info(json);
    logger.info(missing);
}
