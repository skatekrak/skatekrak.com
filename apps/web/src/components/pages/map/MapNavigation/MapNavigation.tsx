import React from 'react';

import MapCreateSpotButton from '../MapCreateSpot/MapCreateSpotButton';
import MapSearch from './MapSearch';

type Props = {
    handleCreateSpotClick: () => void;
};

const MapNavigation = ({ handleCreateSpotClick }: Props) => {
    return (
        <div className="absolute top-4 left-4 right-4 z-[990] tablet:right-auto tablet:min-w-[24rem] laptop:top-6 laptop:left-6">
            <div className="flex items-center">
                <MapSearch />
                <MapCreateSpotButton onClick={handleCreateSpotClick} />
            </div>
            {/* <MapFilters /> */}
        </div>
    );
};

export default React.memo(MapNavigation);
