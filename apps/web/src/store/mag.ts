import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Post } from 'wordpress-types';

export type SlicePost = Pick<Post, 'categories' | 'slug' | 'title' | 'featuredImages' | 'id'>;

type MagStore = {
    selectedCategories: string[];
    search: string;
    articles: SlicePost[];

    toggleCategory: (category: string) => void;
    setSearch: (search: string) => void;
    setArticles: (articles: SlicePost[]) => void;
    resetCategories: () => void;
};

export const useMagStore = create<MagStore>()(
    devtools(
        persist(
            (set) => ({
                selectedCategories: [],
                search: '',
                articles: [],

                toggleCategory: (category) =>
                    set((state) => {
                        const index = state.selectedCategories.indexOf(category);
                        return {
                            selectedCategories:
                                index === -1
                                    ? [...state.selectedCategories, category]
                                    : state.selectedCategories.filter((_, i) => i !== index),
                        };
                    }),
                setSearch: (search) => set({ search }),
                setArticles: (articles) => set({ articles }),
                resetCategories: () => set({ selectedCategories: [] }),
            }),
            {
                name: 'skatekrak-mag',
                partialize: (state) => ({
                    selectedCategories: state.selectedCategories,
                    search: state.search,
                }),
            },
        ),
    ),
);
