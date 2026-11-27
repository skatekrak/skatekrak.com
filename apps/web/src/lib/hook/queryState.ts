import { parseAsBoolean, parseAsFloat, parseAsString, parseAsStringLiteral, useQueryState, useQueryStates } from 'nuqs';
import { useCallback } from 'react';

export type MediaTabType = 'map' | 'all';

export const cityPanelTabs = ['video', 'media', 'spots', 'skaters', 'lens-masters'] as const;
export type CityPanelTab = (typeof cityPanelTabs)[number];

export const customMapPanelTabs = ['media', 'video', 'spots', 'soundtrack'] as const;
export type CustomMapPanelTab = (typeof customMapPanelTabs)[number];

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

const destinationHistory = { history: 'push' } as const;

/** Changing the map also clears its panel tab, so a new map opens on the default tab. */
export const useCustomMapID = () => {
    const [{ id }, set] = useQueryStates({ id: parseAsString, mapPanel: parseAsString }, destinationHistory);
    const setCustomMapID = useCallback((value: string | null) => set({ id: value, mapPanel: null }), [set]);
    return [id, setCustomMapID] as const;
};

/** Changing the city also clears its panel tab, so a new city opens on the default tab. */
export const useCityID = () => {
    const [{ city }, set] = useQueryStates({ city: parseAsString, panel: parseAsString }, destinationHistory);
    const setCityID = useCallback((value: string | null) => set({ city: value, panel: null }), [set]);
    return [city, setCityID] as const;
};

export const useCountryID = () => {
    return useQueryState('country', destinationHistory);
};

/** Kept on the current history entry so back from a map returns to the same city tab. */
export const useCityPanelTab = () => {
    return useQueryState(
        'panel',
        parseAsStringLiteral(cityPanelTabs).withDefault('video').withOptions({ history: 'replace' }),
    );
};

/** Kept on the current history entry so back returns to the same custom map tab. */
export const useCustomMapPanelTab = () => {
    return useQueryState(
        'mapPanel',
        parseAsStringLiteral(customMapPanelTabs).withDefault('media').withOptions({ history: 'replace' }),
    );
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
