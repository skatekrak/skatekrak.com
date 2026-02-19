import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Source } from 'rss-feed';

type VideosStore = {
    selectSources: string[];
    search: string;

    toggleVideosSource: (id: string) => void;
    selectVideosSources: (sources: Source[]) => void;
    setSearch: (search: string) => void;
    resetVideos: () => void;
};

export const useVideosStore = create<VideosStore>()(
    devtools(
        persist(
            (set) => ({
                selectSources: [],
                search: '',

                toggleVideosSource: (id) =>
                    set((state) => {
                        const index = state.selectSources.indexOf(id);
                        return {
                            selectSources:
                                index === -1
                                    ? [...state.selectSources, id]
                                    : state.selectSources.filter((_, i) => i !== index),
                        };
                    }),
                selectVideosSources: (sources) =>
                    set({ selectSources: sources.map((source) => String(source.id)) }),
                setSearch: (search) => set({ search }),
                resetVideos: () => set({ selectSources: [] }),
            }),
            {
                name: 'skatekrak-videos',
                partialize: (state) => ({
                    selectSources: state.selectSources,
                    search: state.search,
                }),
            },
        ),
    ),
);
