import { os } from './base';
import { createSpot, getSpot, getSpotOverview, getSpotsGeoJSON, listByTags, reverseGeocodeSpot, addClipToSpot, getVideoInfo } from './routers/spots';
import { fetchMap, listMaps } from './routers/maps';
import { getById, listBySpot, getSpotMediasAround, list, getHashtagMediasAround, listClipsBySpot, uploadToSpot } from './routers/media';
import { me } from './routers/profiles';
import { listUsers, getUserByUsername } from './routers/admin';

export const router = os.router({
    spots: {
        create: createSpot,
        getSpot,
        getSpotOverview,
        getSpotsGeoJSON,
        listByTags,
        reverseGeocode: reverseGeocodeSpot,
        addClipToSpot,
        getVideoInformation: getVideoInfo,
    },
    maps: {
        fetch: fetchMap,
        list: listMaps,
    },
    media: {
        getById,
        listBySpot,
        getSpotMediasAround,
        list,
        getHashtagMediasAround,
        listClipsBySpot,
        uploadToSpot,
    },
    profiles: {
        me,
    },
    admin: {
        users: {
            list: listUsers,
            getByUsername: getUserByUsername,
        },
    },
});
