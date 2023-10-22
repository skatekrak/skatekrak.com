import axios from 'axios';

export interface Stat {
    createdAt: Date;
    className: string;
    all: number;
    monthly: number;
    weekly: number;
    daily: number;
}

export interface CloudinaryFile {
    publicId: string;
    version: string;
    url: string;
    format: string;
    width: number;
    height: number;
    jpg: string;
}

export interface Profile {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    className: string;
    description: string;
    location: string;
    stance: Stances;
    snapchat: string;
    instagram: string;
    website: string;
    sponsors: string[];
    profilePicture: CloudinaryFile;
    banner: CloudinaryFile;
    followersStat: Stat;
    followers: Profile[];
    followingStat: Stat;
    following: Profile[];
    spotsFollowingStat: Stat;
    spotsFollowing: Spot[];
    mediasStat: Stat;
    clipsStat: Stat;
    tricksDoneStat: Stat;
}

export enum Types {
    Shop = 'shop',
    Street = 'street',
    Park = 'park',
    Diy = 'diy',
    Private = 'private',
}

export enum Status {
    Active = 'active',
    Wip = 'wip',
    Rip = 'rip',
}

export enum Stances {
    Regular = 'regular',
    Goofy = 'goofy',
}

export interface Location {
    streetName: string;
    streetNumber: string;
    city: string;
    country: string;
    longitude: number;
    latitude: number;
}

export interface Like {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    addedBy: Profile;
}

export interface Comment {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    _content: string;
    content?: string;
    addedBy: Profile;
    hashtags: string[];
    usertags: string[];
    likes: Like[];
}

export interface AddedBy {
    username: string;
    id: string;
    profilePicture?: {
        url: string;
        publicId: string;
        jpg: string;
    };
}

export enum VideoProvider {
    YOUTUBE = 'youtube',
    VIMEO = 'vimeo',
}

export interface Clip {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    provider: VideoProvider;
    videoURL: string;
    thumbnailURL: string;
    spot: string;
    addedBy: AddedBy;
}

export interface Spot {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    className: string;
    name: string;
    location: Location;
    geo: number[];
    geoHash: string;
    type: Types;
    status: Status;
    description: string;
    indoor: boolean;
    openingHours: string[];
    phone: string;
    website: string;
    instagram: string;
    snapchat: string;
    facebook: string;
    addedBy: Profile;
    coverURL: string;
    commentsStat: Stat;
    comments: Comment[];
    mediasStat: Stat;
    clipsStat: Stat;
    tricksDoneStat: Stat;
    tags: string[];
}

export interface Cluster {
    id: string;
    latitude: number;
    longitude: number;
    count: number;
    maxLatitude: number;
    maxLongitude: number;
    minLatitude: number;
    minLongitude: number;
    spots: Spot[];
}

export interface Media {
    id: string;
    image: CloudinaryFile;
    video?: CloudinaryFile;
    addedBy: AddedBy;
    spot?: Spot;
    type: 'image' | 'video';
    createdAt: Date;
    updatedAt: Date;
    caption?: string;
    // TODO: complete Media interface
}

export interface SpotOverview {
    spot: Spot;
    medias: Media[];
    clips: Clip[];
    mostLikedMedia?: Media;
    // TODO: complete SpotOverview interface
}

export const carrelage = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_CARRELAGE_URL}`,
});

export type FiltersParams = {
    indoor?: boolean;
    type: Types[];
    status: Status[];
};

export type QuerySearchSpotsParam = {
    query?: string;
    filters?: FiltersParams;
};

export type BoxSearchSpotsParams = {
    northEastLatitude?: number;
    northEastLongitude?: number;
    southWestLatitude?: number;
    southWestLongitude?: number;
    filters?: FiltersParams;
    limit?: number;
};

export type SearchSpotsParams = QuerySearchSpotsParam & BoxSearchSpotsParams;

/**
 * Search and returns spots with given map bounds
 * @param params
 */
export const boxSpotsSearch = async (params: BoxSearchSpotsParams) => {
    const res = await carrelage.get<Spot[]>('/spots/search', { params });
    return res.data;
};

/**
 * Search and returns spots with query search (on name, description and address)
 * @param params
 */
export const querySpotsSearch = async (params: QuerySearchSpotsParam) => {
    const res = await carrelage.get<Spot[]>('/spots/search', { params });
    return res.data;
};

export const searchSpots = (params: SearchSpotsParams) => {
    return carrelage.get('/spots/search', { params });
};

export const getSpotOverview = async (spotId: string): Promise<SpotOverview> => {
    const res = await carrelage.get<SpotOverview>(`/spots/${spotId}/overview`);
    return res.data;
};

export const getSpotsByTags = async (tags: string[]): Promise<Spot[]> => {
    const res = await carrelage.get<Spot[]>(`/spots/by-tags`, { params: { tags } });
    return res.data;
};

export const getClips = async (spotId: string, older: Date = new Date(), limit = 10) => {
    const res = await carrelage.get<Clip[]>(`/spots/${spotId}/clips`, {
        params: {
            older,
            limit,
        },
    });

    return res.data;
};

export default carrelage;
