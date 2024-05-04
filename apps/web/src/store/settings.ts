import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export enum FeedLayout {
    OneColumn = 768,
    TwoColumns = 1440,
    FourColumns = 1000000,
}

export type SettingsState = {
    isMobile: boolean;
    feedLayout: FeedLayout | null;

    setDeviceSize: (size: number) => void;
};

export const useSettingsStore = create<SettingsState>()(
    devtools((set) => ({
        isMobile: false,
        feedLayout: null,

        setDeviceSize: (size) => {
            const isMobile = size < 1024;

            if (size < FeedLayout.OneColumn) {
                return set({
                    isMobile,
                    feedLayout: FeedLayout.OneColumn,
                });
            } else if (size < FeedLayout.TwoColumns) {
                return set({
                    isMobile,
                    feedLayout: FeedLayout.TwoColumns,
                });
            }

            return set({
                isMobile,
                feedLayout: FeedLayout.FourColumns,
            });
        },
    })),
);
