import React from 'react';

import IconPlus from '@/components/Ui/Icons/IconPlus';

type Props = {
    onClick: () => void;
};

const MapCreateSpotButton: React.FC<Props> = ({ onClick }) => {
    return (
        <button
            className="shrink-0 flex items-center gap-2 ml-3 px-4 py-2.5 bg-primary-80 rounded shadow-onDarkHighSharp transition-all duration-100 hover:bg-primary-100 active:scale-95 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:fill-white"
            onClick={onClick}
        >
            <IconPlus />
            <span className="font-roboto-condensed-bold text-[0.875rem] tracking-[0.04em] uppercase text-white whitespace-nowrap">
                Add Your Spot
            </span>
        </button>
    );
};

export default MapCreateSpotButton;
