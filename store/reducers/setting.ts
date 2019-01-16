export const SET_DEVICE_SIZE = 'SET_DEVICE_SIZE';

export type State = {
    isMobile: boolean | null;
};

const initialState: State = {
    isMobile: null,
};

export default (state = initialState, action: any = {}) => {
    switch (action.type) {
        case SET_DEVICE_SIZE: {
            return {
                ...state,
                isMobile: action.width < 1024,
            };
        }
        default:
            return state;
    }
};

export const setDeviceSize = (width: number) => ({
    type: SET_DEVICE_SIZE,
    width,
});
