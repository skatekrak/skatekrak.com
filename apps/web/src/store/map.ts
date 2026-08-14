import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { contract } from '@krak/contracts';
import type { Status, Types } from '@krak/types';

import type { InferContractRouterOutputs } from '@orpc/contract';

type SpotOverview = InferContractRouterOutputs<typeof contract>['spots']['getSpotOverview'];

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

export const mapStyles = ['dark', 'satellite-streets-v12', 'light'] as const;
export type MapStyle = (typeof mapStyles)[number];

type MapStore = {
    spotOverview: SpotOverview | null;
    legendOpen: boolean;
    searchResultIsOpen: boolean;
    videoPlayingId: string | null;
    isCreateSpotOpen: boolean;
    isSidePanelOpen: boolean;
    filters: (Types | Status)[];
    mapStyle: MapStyle;

    setSpotOverview: (spotOverview: SpotOverview | null) => void;
    toggleLegend: (value: boolean) => void;
    setVideoPlaying: (videoId: string | null) => void;
    toggleSearchResult: (value: boolean) => void;
    toggleCreateSpot: () => void;
    toggleSidePanel: (value: boolean) => void;
    toggleFilter: (filter: Types | Status) => void;
    setMapStyle: (style: MapStyle) => void;
};

export const useMapStore = create<MapStore>()(
    devtools(
        (set) => ({
            spotOverview: null,
            legendOpen: false,
            searchResultIsOpen: false,
            videoPlayingId: null,
            isCreateSpotOpen: false,
            isSidePanelOpen: true,
            filters: [],
            mapStyle: 'dark',

            setSpotOverview: (spotOverview) => set({ spotOverview }),
            toggleLegend: (value) => set({ legendOpen: value }),
            setVideoPlaying: (videoPlayingId) => set({ videoPlayingId }),
            toggleSearchResult: (value) => set({ searchResultIsOpen: value, legendOpen: false }),
            toggleCreateSpot: () => set((state) => ({ isCreateSpotOpen: !state.isCreateSpotOpen })),
            toggleSidePanel: (value) => set({ isSidePanelOpen: value }),
            toggleFilter: (filter) =>
                set((state) => {
                    const filters = state.filters.includes(filter)
                        ? state.filters.filter((f) => f !== filter)
                        : [...state.filters, filter];
                    return { filters };
                }),
            setMapStyle: (mapStyle) => set({ mapStyle }),
        }),
        { enabled: process.env.NODE_ENV !== 'production' },
    ),
);
