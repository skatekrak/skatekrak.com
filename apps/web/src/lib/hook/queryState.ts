import { parseAsFloat, parseAsBoolean, parseAsString, useQueryState, useQueryStates } from 'nuqs';

export const useViewport = () => {
    return useQueryStates(
        {
            latitude: parseAsFloat.withDefault(48.860332),
            longitude: parseAsFloat.withDefault(2.345054),
            zoom: parseAsFloat.withDefault(12.6),
        },
        {
            throttleMs: 400,
        },
    );
};

export const useCustomMapID = () => {
    return useQueryState('id');
};

export const useSpotID = () => {
    return useQueryState('spot');
};

export const useSpotModal = () => {
    return useQueryState('modal', parseAsBoolean.withDefault(false));
};

export const useMediaID = () => {
    return useQueryState('media');
};

export const useFullSpotSelectedTab = () => {
    return useQueryState('tab', parseAsString.withDefault('media'));
};
