export const SET_DEVICE_SIZE = 'SET_DEVICE_SIZE';

export enum FeedLayout {
    OneColumn = 768,
    TwoColumns = 1440,
    FourColumns = 1000000,
}

export type State = {
    isMobile: boolean;
    feedLayout: FeedLayout;
};

const initialState: State = {
    isMobile: null,
    feedLayout: null,
};

export default (state = initialState, action: any = {}) => {
    switch (action.type) {
        case SET_DEVICE_SIZE: {
            const res = { ...state, isMobile: action.width < 1024 };
            if (action.width < FeedLayout.OneColumn) {
                res.feedLayout = FeedLayout.OneColumn;
            } else if (action.width < FeedLayout.TwoColumns) {
                res.feedLayout = FeedLayout.TwoColumns;
            } else {
                res.feedLayout = FeedLayout.FourColumns;
            }
            return res;
        }
        default:
            return state;
    }
};

export const setDeviceSize = (width: number) => ({
    type: SET_DEVICE_SIZE,
    width,
});
