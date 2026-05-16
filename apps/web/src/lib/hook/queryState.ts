import { parseAsFloat, parseAsBoolean, parseAsString, useQueryState, useQueryStates, parseAsStringLiteral } from 'nuqs';
import { useCallback } from 'react';

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

const mapStyles = ['dark-v11', 'satellite-streets-v12'] as const;

export const useMapStyle = () => {
    return useQueryState('style', parseAsStringLiteral(mapStyles).withDefault('dark-v11'));
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
