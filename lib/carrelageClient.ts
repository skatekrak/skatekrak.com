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
    width: string;
    height: string;
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
    clustering: boolean;
    northEastLatitude?: number;
    northEastLongitude?: number;
    southWestLatitude?: number;
    southWestLongitude?: number;
    filters?: FiltersParams;
};

export type SearchSpotsParams = QuerySearchSpotsParam & BoxSearchSpotsParams;

/**
 * Search and returns spots with given map bounds
 * @param params
 */
export const boxSpotsSearch = async (params: BoxSearchSpotsParams) => {
    const res = await carrelage.get<Cluster[]>('/spots/search', { params });
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

export default carrelage;