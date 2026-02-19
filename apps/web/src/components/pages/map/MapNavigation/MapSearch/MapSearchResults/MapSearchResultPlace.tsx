import React from 'react';

import PlaceIcon from '@/components/pages/map/marker/icons/Place';
import Typography from '@/components/Ui/typography/Typography';

import { Place } from '@/lib/placeApi';

type Props = {
    place: Place;
    onPlaceClick: (place: Place) => void;
};

const MapSearchResultSpot = ({ place, onPlaceClick }: Props) => {
    const handlePlaceClick = () => {
        onPlaceClick(place);
    };

    return (
        <>
            <button className="relative flex items-center w-full py-2.5 pl-2 pr-4 text-left [&_svg]:!w-8 [&_svg]:!ml-1 [&_.ui-Typography]:italic [&_.ui-Typography]:text-onDark-mediumEmphasis" onClick={handlePlaceClick}>
                <div className="flex flex-col [&_svg]:my-auto [&_svg]:mr-2 [&_svg]:ml-0 [&_svg]:w-9">
                    <PlaceIcon />
                </div>
                <div className="flex flex-col grow overflow-hidden">
                    <Typography truncateLines={1}>{place.name}</Typography>
                </div>
            </button>
            <div className="h-px bg-onDark-divider last-of-type:hidden" />
        </>
    );
};

export default MapSearchResultSpot;
