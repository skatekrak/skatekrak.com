import { os } from './base';
import {
    listUsers,
    getUserByUsername,
    overview,
    listSpots,
    updateSpotGeneralInfo,
    listMedia,
    listClips,
    listAdminMaps,
} from './routers/admin';
import { fetchMap, listMaps } from './routers/maps';
import {
    getById,
    listBySpot,
    getSpotMediasAround,
    list,
    getHashtagMediasAround,
    listClipsBySpot,
    uploadToSpot,
} from './routers/media';
import { me } from './routers/profiles';
import {
    createSpot,
    getSpot,
    getSpotOverview,
    getSpotsGeoJSON,
    listByTags,
    reverseGeocodeSpot,
    addClipToSpot,
    getVideoInfo,
} from './routers/spots';

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
        overview,
        users: {
            list: listUsers,
            getByUsername: getUserByUsername,
        },
        spots: {
            list: listSpots,
            updateGeneralInfo: updateSpotGeneralInfo,
        },
        media: {
            list: listMedia,
        },
        clips: {
            list: listClips,
        },
        maps: {
            list: listAdminMaps,
        },
    },
});
