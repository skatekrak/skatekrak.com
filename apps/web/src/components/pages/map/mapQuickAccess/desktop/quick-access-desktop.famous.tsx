import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';

import { useCityID, useCustomMapID, useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import { orpc } from '@/server/orpc/client';
import { useMapStore } from '@/store/map';

import QuickAccessDesktopPanelToggle from './quick-access-desktop.panel-toggle';

const FAMOUS_MAP_ID = 'famous';

const QuickAccessDesktopFamous = () => {
    const router = useRouter();
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
        <QuickAccessDesktopPanelToggle
            onClick={handleClick}
            selected={router.query.id === famousMap.id}
            isPanelOpen={false}
            imagePath={`assets/maps/custom-maps/${famousMap.id}.png`}
            tooltipText={famousMap.name}
        />
    );
};

export default QuickAccessDesktopFamous;
