import React from 'react';

import IconPlus from '@/components/Ui/Icons/IconPlus';

type Props = {
    onClick: () => void;
};

const MapCreateSpotButton: React.FC<Props> = ({ onClick }) => {
    return (
        <button
            className="shrink-0 flex ml-3 p-2.5 bg-tertiary-dark border-[1.5px] border-tertiary-medium shadow-onDarkHighSharp rounded transition-all duration-100 [&_svg]:w-6 [&_svg]:m-auto [&_svg]:fill-onDark-mediumEmphasis [&_svg]:transition-all [&_svg]:duration-100 hover:border-tertiary-light hover:[&_svg]:fill-onDark-highEmphasis"
            onClick={onClick}
        >
            <IconPlus />
        </button>
    );
};

export default MapCreateSpotButton;
