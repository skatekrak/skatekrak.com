import React from 'react';

import IconCross from 'components/Ui/Icons/Cross';

type Props = {
    subtitle: string;
    about: string;
    onCloseNavigationMode: () => void;
};

const MapCustomNavigationAbout = ({ subtitle, about, onCloseNavigationMode }: Props) => {
    return (
        <div id="custom-map-navigation-extension-about">
            <div id="custom-map-navigation-extension-about-header">
                <h3>{subtitle}</h3>
                <button onClick={onCloseNavigationMode}>
                    <IconCross />
                </button>
            </div>
            <p id="custom-map-navigation-extension-about-desc">{about}</p>
        </div>
    );
};

export default MapCustomNavigationAbout;
