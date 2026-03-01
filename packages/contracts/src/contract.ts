import { oc } from '@orpc/contract';
import { z } from 'zod';

import {
    SpotSchema,
    SpotGeoJSONSchema,
    createSpotInput,
    getSpotInput,
    getSpotOverviewInput,
    getSpotsGeoJSONInput,
    listByTagsInput,
    getVideoInformationInput,
    VideoInformationSchema,
} from './schemas/spots';
import { MediaSchema, ClipSchema, MediasAroundSchema } from './schemas/media';
import { MapSchema, MapListItemSchema, fetchMapInput } from './schemas/maps';
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
};
