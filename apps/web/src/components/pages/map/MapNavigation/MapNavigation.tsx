import { PanelLeftOpen } from 'lucide-react';
import React from 'react';

import { useMapStore } from '@/store/map';
import { useSettingsStore } from '@/store/settings';

import MapCreateSpotButton from '../MapCreateSpot/MapCreateSpotButton';
import MapSearch from './MapSearch';

type Props = {
    handleCreateSpotClick: () => void;
};

const MapNavigation = ({ handleCreateSpotClick }: Props) => {
    const toggleSidePanel = useMapStore((state) => state.toggleSidePanel);
    const isSidePanelOpen = useMapStore((state) => state.isSidePanelOpen);
    const isMobile = useSettingsStore((state) => state.isMobile);

    return (
        <div className="absolute top-4 left-4 right-4 z-1010 tablet:right-auto tablet:min-w-lg laptop:top-6 laptop:left-6">
            <div className="flex items-center gap-3">
                {!isMobile && !isSidePanelOpen && (
                    <button
                        type="button"
                        onClick={() => toggleSidePanel(true)}
                        className="p-2 bg-tertiary-dark border-[1.5px] border-tertiary-medium hover:border-tertiary-light shadow-onDarkHighSharp rounded transition-all duration-100"
                    >
                        <PanelLeftOpen className="text-tertiary-white opacity-70" />
                    </button>
                )}
                <MapSearch />
                <MapCreateSpotButton onClick={handleCreateSpotClick} />
            </div>
            {/* <MapFilters /> */}
        </div>
    );
};

export default React.memo(MapNavigation);
