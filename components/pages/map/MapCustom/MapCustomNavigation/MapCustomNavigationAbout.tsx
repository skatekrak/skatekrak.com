import React from 'react';

type Props = {
    subtitle: string;
    about: string;
};

const MapCustomNavigationAbout = ({ subtitle, about }: Props) => {
    return (
        <div id="custom-map-navigation-extension-about">
            <div id="custom-map-navigation-extension-about-header">
                <h3>{subtitle}</h3>
            </div>
            <p id="custom-map-navigation-extension-about-desc">{about}</p>
        </div>
    );
};

export default MapCustomNavigationAbout;
