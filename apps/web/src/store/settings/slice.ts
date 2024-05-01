import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum FeedLayout {
    OneColumn = 768,
    TwoColumns = 1440,
    FourColumns = 1000000,
}

export type State = {
    isMobile: boolean;
    feedLayout: FeedLayout | null;
};

const initialState: State = {
    isMobile: false,
    feedLayout: null,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setDeviceSize: (state, action: PayloadAction<number>) => {
            const res = { ...state, isMobile: action.payload < 1024 };
            if (action.payload < FeedLayout.OneColumn) {
                res.feedLayout = FeedLayout.OneColumn;
            } else if (action.payload < FeedLayout.TwoColumns) {
                res.feedLayout = FeedLayout.TwoColumns;
            } else {
                res.feedLayout = FeedLayout.FourColumns;
            }
            return res;
        },
    },
});

export const { setDeviceSize } = settingsSlice.actions;

export default settingsSlice.reducer;
