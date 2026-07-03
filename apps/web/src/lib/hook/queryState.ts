import { parseAsFloat, parseAsBoolean, parseAsString, parseAsStringLiteral, useQueryState, useQueryStates } from 'nuqs';
import { useCallback } from 'react';

export type MediaTabType = 'map' | 'all';

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

export const useCityID = () => {
    return useQueryState('city');
};

export const useSpotID = () => {
    return useQueryState('spot');
};

export const useSpotModal = () => {
    const [modalVisible, setModalVisible] = useQueryState('modal', parseAsBoolean.withDefault(false));

    const setModal = useCallback(
        (value: boolean | null) => {
            const history = value ? 'push' : 'replace';
            return setModalVisible(value, { history });
        },
        [setModalVisible],
    );

    return [modalVisible, setModal] as const;
};

export const useMediaID = () => {
    return useQueryState('media');
};

export const useFullSpotSelectedTab = () => {
    return useQueryState('tab', parseAsString.withDefault('media'));
};

export const useMediaTab = (defaultTab: MediaTabType = 'all') => {
    return useQueryState(
        'mediaTab',
        parseAsStringLiteral(['map', 'all'] satisfies MediaTabType[]).withDefault(defaultTab),
    );
};
