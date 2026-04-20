import { oc } from '@orpc/contract';
import { z } from 'zod';

import {
    listUsersInput,
    listUsersOutput,
    getUserByUsernameInput,
    getUserByUsernameOutput,
    adminOverviewOutput,
    adminListSpotsInput,
    adminListSpotsOutput,
    updateSpotGeneralInfoInput,
    updateSpotGeneralInfoOutput,
    adminListMediaInput,
    adminListMediaOutput,
    adminListClipsInput,
    adminListClipsOutput,
    adminListMapsInput,
    adminListMapsOutput,
    createMapInput,
} from './schemas/admin';
import { MapSchema, MapListItemSchema, fetchMapInput } from './schemas/maps';
import { MediaSchema, ClipSchema, MediasAroundSchema } from './schemas/media';
import {
    getMediaByIdInput,
    listBySpotInput,
    getSpotMediasAroundInput,
    listMediaInput,
    getHashtagMediasAroundInput,
    listClipsBySpotInput,
    addClipToSpotInput,
    uploadToSpotInput,
} from './schemas/media';
import { ProfileMeSchema } from './schemas/profiles';
import {
    SpotSchema,
    SpotGeoJSONSchema,
    createSpotInput,
    getSpotInput,
    getSpotOverviewInput,
    getSpotsGeoJSONInput,
    listByTagsInput,
    reverseGeocodeInput,
    ReverseGeocodeResultSchema,
    getVideoInformationInput,
    VideoInformationSchema,
} from './schemas/spots';

// ============================================================================
// SpotOverview output (composite — uses Spot + Media + Clip schemas)
// ============================================================================

const SpotOverviewSchema = z.object({
    spot: SpotSchema,
    medias: z.array(MediaSchema),
    clips: z.array(ClipSchema),
    mostLikedMedia: MediaSchema.optional(),
});

// ============================================================================
// Contract definition
// ============================================================================

export const contract = {
    spots: {
        create: oc.input(createSpotInput).output(SpotSchema),
        getSpot: oc.input(getSpotInput).output(SpotSchema),
        getSpotOverview: oc.input(getSpotOverviewInput).output(SpotOverviewSchema),
        getSpotsGeoJSON: oc.input(getSpotsGeoJSONInput).output(z.array(SpotGeoJSONSchema)),
        listByTags: oc.input(listByTagsInput).output(z.array(SpotSchema)),
        addClipToSpot: oc.input(addClipToSpotInput).output(ClipSchema),
        reverseGeocode: oc.input(reverseGeocodeInput).output(ReverseGeocodeResultSchema),
        getVideoInformation: oc.input(getVideoInformationInput).output(VideoInformationSchema),
    },
    maps: {
        fetch: oc.input(fetchMapInput).output(MapSchema),
        list: oc.output(z.array(MapListItemSchema)),
    },
    media: {
        getById: oc.input(getMediaByIdInput).output(MediaSchema),
        listBySpot: oc.input(listBySpotInput).output(z.array(MediaSchema)),
        getSpotMediasAround: oc.input(getSpotMediasAroundInput).output(MediasAroundSchema),
        list: oc.input(listMediaInput).output(z.array(MediaSchema)),
        getHashtagMediasAround: oc.input(getHashtagMediasAroundInput).output(MediasAroundSchema),
        listClipsBySpot: oc.input(listClipsBySpotInput).output(z.array(ClipSchema)),
        uploadToSpot: oc.input(uploadToSpotInput).output(MediaSchema),
    },
    profiles: {
        me: oc.output(ProfileMeSchema),
    },
    admin: {
        overview: oc.output(adminOverviewOutput),
        users: {
            list: oc.input(listUsersInput).output(listUsersOutput),
            getByUsername: oc.input(getUserByUsernameInput).output(getUserByUsernameOutput),
        },
        spots: {
            list: oc.input(adminListSpotsInput).output(adminListSpotsOutput),
            updateGeneralInfo: oc.input(updateSpotGeneralInfoInput).output(updateSpotGeneralInfoOutput),
        },
        media: {
            list: oc.input(adminListMediaInput).output(adminListMediaOutput),
        },
        clips: {
            list: oc.input(adminListClipsInput).output(adminListClipsOutput),
        },
        maps: {
            list: oc.input(adminListMapsInput).output(adminListMapsOutput),
            create: oc.input(createMapInput).output(MapSchema),
        },
    },
};
