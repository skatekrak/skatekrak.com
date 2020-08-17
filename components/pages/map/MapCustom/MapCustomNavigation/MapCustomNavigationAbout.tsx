import React from 'react';

import IconCross from 'components/Ui/Icons/Cross';

type Props = {
    map: any;
    onCloseNavigationMode: () => void;
};

const MapCustomNavigationAbout = ({ map, onCloseNavigationMode }: Props) => {
    return (
        <div id="custom-map-navigation-extension-about">
            <div id="custom-map-navigation-extension-about-header">
                <h3>{map.name}</h3>
                <button onClick={onCloseNavigationMode}>
                    <IconCross />
                </button>
            </div>
            <p id="custom-map-navigation-extension-about-desc">{map.about}</p>
        </div>
    );
};

export default MapCustomNavigationAbout;
