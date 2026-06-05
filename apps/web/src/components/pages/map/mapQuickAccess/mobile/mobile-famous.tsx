import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import Typography from '@/components/Ui/typography/Typography';
import { useCityID, useCustomMapID, useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import { orpc } from '@/server/orpc/client';
import { useMapStore } from '@/store/map';

const FAMOUS_MAP_ID = 'famous';

const MobileFamous: React.FC = () => {
    const [toggleLegend, toggleSearchResult] = useMapStore(
        useShallow((state) => [state.toggleLegend, state.toggleSearchResult]),
    );
    const [, setCustomMapID] = useCustomMapID();
    const [, setCityID] = useCityID();
    const [, setModalVisible] = useSpotModal();
    const [, setSpotID] = useSpotID();
    const [, setMediaID] = useMediaID();

    const { isLoading, data } = useQuery(orpc.maps.list.queryOptions({}));

    if (isLoading || !data) {
        return null;
    }

    const famousMap = data.find((map) => map.id === FAMOUS_MAP_ID);

    if (famousMap == null) {
        return null;
    }

    const handleClick = () => {
        toggleLegend(false);
        toggleSearchResult(false);

        setCustomMapID(famousMap.id);
        setCityID(null);
        setSpotID(null);
        setModalVisible(null);
        setMediaID(null);
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center py-3 px-4 text-onDark-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-onDarkHighSharp"
        >
            <Typography component="condensedButton">{famousMap.name}</Typography>
        </button>
    );
};

export default MobileFamous;
