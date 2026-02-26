import { type Spot, type Media, type Clip, Status, Types } from '@krak/carrelage-client';
import type {
    Spot as PrismaSpot,
    Media as PrismaMedia,
    Clip as PrismaClip,
    Profile as PrismaProfile,
    User as PrismaUser,
} from '@krak/prisma';

// ============================================================================
// Composite Prisma types (with relations included)
// ============================================================================

export type ProfileWithUser = PrismaProfile & { user: Pick<PrismaUser, 'username'> };
export type SpotWithAddedBy = PrismaSpot & { addedBy: ProfileWithUser };
export type MediaWithRelations = PrismaMedia & { addedBy: ProfileWithUser; spot?: PrismaSpot | null };
export type ClipWithRelations = PrismaClip & { addedBy: ProfileWithUser; spot?: PrismaSpot | null };

// ============================================================================
// Prisma -> Carrelage-client type formatters
// ============================================================================

export function formatPrismaSpot(spot: SpotWithAddedBy): Spot {
    return {
        id: spot.id,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        className: 'Spot',
        name: spot.name,
        location: {
            streetName: spot.streetName ?? '',
            streetNumber: spot.streetNumber ?? '',
            city: spot.city ?? '',
            country: spot.country ?? '',
            longitude: spot.longitude,
            latitude: spot.latitude,
        },
        geo: [spot.longitude, spot.latitude],
        geoHash: '',
        type: spot.type.toLowerCase() as Types,
        status: spot.status.toLowerCase() as Status,
        description: spot.description ?? '',
        indoor: spot.indoor,
        openingHours: spot.openingHours,
        phone: spot.phone ?? '',
        website: spot.website ?? '',
        instagram: spot.instagram ?? '',
        snapchat: spot.snapchat ?? '',
        facebook: spot.facebook ?? '',
        addedBy: formatPrismaProfile(spot.addedBy),
        coverURL: spot.coverURL ?? '',
        commentsStat: formatStat(spot.commentsStat),
        comments: [],
        mediasStat: formatStat(spot.mediasStat),
        clipsStat: formatStat(spot.clipsStat),
        tricksDoneStat: formatStat(spot.tricksDoneStat),
        tags: spot.tags,
    };
}

export function formatPrismaMedia(media: MediaWithRelations): Media {
    return {
        id: media.id,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt,
        type: media.type.toLowerCase() as 'image' | 'video',
        caption: media.caption ?? undefined,
        image: media.image as unknown as Media['image'],
        video: (media.video as unknown as Media['video']) ?? undefined,
        addedBy: {
            id: media.addedBy.id,
            username: media.addedBy.user.username,
            profilePicture: media.addedBy.profilePicture as Media['addedBy']['profilePicture'],
        },
        spot: media.spot ? formatPrismaSpot(media.spot as SpotWithAddedBy) : undefined,
    };
}

export function formatPrismaClip(clip: ClipWithRelations): Clip {
    return {
        id: clip.id,
        createdAt: clip.createdAt,
        updatedAt: clip.updatedAt,
        title: clip.title,
        provider: clip.provider.toLowerCase() as Clip['provider'],
        videoURL: clip.videoURL,
        thumbnailURL: clip.thumbnailURL,
        spot: clip.spotId ?? '',
        addedBy: {
            id: clip.addedBy.id,
            username: clip.addedBy.user.username,
            profilePicture: clip.addedBy.profilePicture as Clip['addedBy']['profilePicture'],
        },
    };
}

export function formatPrismaProfile(profile: ProfileWithUser) {
    return {
        id: profile.id,
        username: profile.user.username,
        profilePicture: profile.profilePicture,
    } as any;
}

export function formatStat(stat: any) {
    if (!stat) {
        return { createdAt: new Date(), className: 'Stat', all: 0, monthly: 0, weekly: 0, daily: 0 };
    }
    return {
        createdAt: stat.createdAt ? new Date(stat.createdAt) : new Date(),
        className: stat.className ?? 'Stat',
        all: stat.all ?? 0,
        monthly: stat.monthly ?? 0,
        weekly: stat.weekly ?? 0,
        daily: stat.daily ?? 0,
    };
}
