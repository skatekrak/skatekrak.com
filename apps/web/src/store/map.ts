import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { SpotOverview, Status, Types } from '@krak/carrelage-client';

export type FullSpotTab =
    | 'info'
    | 'clips'
    | 'addClip'
    | 'tips'
    | 'edito'
    | 'media'
    | 'addMedia'
    | 'contests'
    | 'events'
    | 'instagram'
    | 'contributors';

type MapStore = {
    spotOverview: SpotOverview | null;
    legendOpen: boolean;
    searchResultIsOpen: boolean;
    videoPlayingId: string | null;
    isCreateSpotOpen: boolean;
    filters: (Types | Status)[];

    setSpotOverview: (spotOverview: SpotOverview | null) => void;
    toggleLegend: (value: boolean) => void;
    setVideoPlaying: (videoId: string | null) => void;
    toggleSearchResult: (value: boolean) => void;
    toggleCreateSpot: () => void;
    toggleFilter: (filter: Types | Status) => void;
};

export const useMapStore = create<MapStore>()(
    devtools((set) => ({
        spotOverview: null,
        legendOpen: false,
        searchResultIsOpen: false,
        videoPlayingId: null,
        isCreateSpotOpen: false,
        filters: [],

        setSpotOverview: (spotOverview) => set({ spotOverview }),
        toggleLegend: (value) => set({ legendOpen: value }),
        setVideoPlaying: (videoPlayingId) => set({ videoPlayingId }),
        toggleSearchResult: (value) => set({ searchResultIsOpen: value, legendOpen: false }),
        toggleCreateSpot: () => set((state) => ({ isCreateSpotOpen: !state.isCreateSpotOpen })),
        toggleFilter: (filter) =>
            set((state) => {
                const filters = state.filters.includes(filter)
                    ? state.filters.filter((f) => f !== filter)
                    : [...state.filters, filter];
                return { filters };
            }),
    })),
);
