import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { SpotOverview } from '@krak/carrelage-client';

type MapStore = {
    spotOverview: SpotOverview | null;
    legendOpen: boolean;
    searchResultIsOpen: boolean;
    videoPlayingId: string | null;
    isCreateSpotOpen: boolean;

    setSpotOverview: (spotOverview: SpotOverview | null) => void;
    toggleLegend: (value: boolean) => void;
    setVideoPlaying: (videoId: string | null) => void;
    toggleSearchResult: (value: boolean) => void;
    toggleCreateSpot: () => void;
};

export const useMapStore = create<MapStore>()(
    devtools((set) => ({
        spotOverview: null,
        legendOpen: false,
        searchResultIsOpen: false,
        videoPlayingId: null,
        isCreateSpotOpen: false,

        setSpotOverview: (spotOverview) => set({ spotOverview }),
        toggleLegend: (value) => set({ legendOpen: value }),
        setVideoPlaying: (videoPlayingId) => set({ videoPlayingId }),
        toggleSearchResult: (value) => set({ searchResultIsOpen: value, legendOpen: false }),
        toggleCreateSpot: () => set((state) => ({ isCreateSpotOpen: !state.isCreateSpotOpen })),
    })),
);
