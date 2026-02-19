import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Source } from 'rss-feed';

type NewsStore = {
    selectSources: string[];
    search: string;

    selectNewsSources: (sources: Source[]) => void;
    toggleNewsSource: (id: string) => void;
    setSearch: (search: string) => void;
    resetNews: () => void;
};

export const useNewsStore = create<NewsStore>()(
    devtools(
        persist(
            (set) => ({
                selectSources: [],
                search: '',

                selectNewsSources: (sources) =>
                    set({ selectSources: sources.map((source) => `${source.id}`) }),
                toggleNewsSource: (id) =>
                    set((state) => {
                        const index = state.selectSources.indexOf(id);
                        return {
                            selectSources:
                                index === -1
                                    ? [...state.selectSources, id]
                                    : state.selectSources.filter((_, i) => i !== index),
                        };
                    }),
                setSearch: (search) => set({ search }),
                resetNews: () => set({ selectSources: [] }),
            }),
            {
                name: 'skatekrak-news',
                partialize: (state) => ({
                    selectSources: state.selectSources,
                    search: state.search,
                }),
            },
        ),
    ),
);
