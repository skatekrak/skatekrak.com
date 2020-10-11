import React, { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';

import ScrollBar from 'components/Ui/Scrollbar';
import MapFullSpotMainClips from './MapFullSpotMainClips';

const MapFullSpotMain = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollBarMaxHeight, setScrollBarMaxHeight] = useState('100%');
    const scrollContainer = document.getElementsByClassName('simplebar-content-wrapper')[0];
    const headerElement = document.getElementById('map-full-spot-popup-main-header');

    const handleContainerScroll = (evt) => {
        if (evt.target.scrollTop > 40) {
            setScrollBarMaxHeight('calc(100% - 53px)');
            setIsScrolled(true);
        } else {
            setScrollBarMaxHeight('calc(100% - 117px)');
            setIsScrolled(false);
        }

        if (isScrolled) {
            headerElement.classList.add('map-full-spot-popup-main-header--fixed');
        } else {
            headerElement.classList.remove('map-full-spot-popup-main-header--fixed');
        }
    };

    useEffect(() => {
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleContainerScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleContainerScroll);
            }
        };
    });

    return (
        <>
            <div id="map-full-spot-popup-main-header">
                <nav id="map-full-spot-popup-main-header-nav">
                    <button className="map-full-spot-popup-main-header-nav-item">recent</button>
                    <button className="map-full-spot-popup-main-header-nav-item">history</button>
                    <button className="map-full-spot-popup-main-header-nav-item">minute</button>
                    <button className="map-full-spot-popup-main-header-nav-item">featured</button>
                </nav>
            </div>
            <ScrollBar maxHeight={scrollBarMaxHeight}>
                <div id="map-full-spot-popup-main">
                    <MapFullSpotMainClips />
                </div>
            </ScrollBar>
        </>
    );
};

export default MapFullSpotMain;
