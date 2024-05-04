import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs';

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
