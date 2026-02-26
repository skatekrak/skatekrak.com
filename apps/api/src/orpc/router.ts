import { os } from './base';
import { getSpot, getSpotOverview, getSpotsGeoJSON, listByTags, addClipToSpot, getVideoInfo } from './routers/spots';
import { fetchMap, listMaps } from './routers/maps';
import { getById, listBySpot, getSpotMediasAround, list, getHashtagMediasAround, listClipsBySpot } from './routers/media';
import { me } from './routers/profiles';

export const router = os.router({
    spots: {
        getSpot,
        getSpotOverview,
        getSpotsGeoJSON,
        listByTags,
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
    },
    profiles: {
        me,
    },
});
