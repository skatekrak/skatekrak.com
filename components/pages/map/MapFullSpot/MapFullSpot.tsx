import React from 'react';
import { useRouter } from 'next/router';

import Modal from 'components/Ui/Modal';
import MapFullSpotNav from './MapFullSpotNav';
import MapFullSpotMain from './MapFullSpotMain';

type MapFullSpotProps = {
    open: boolean;
    onClose: () => void;
    container: Element | undefined;
};

const MapFullSpot: React.FC<MapFullSpotProps> = ({ open, onClose, container }) => {
    const router = useRouter();
    console.log(container);

    let classNames = {
        customOverlay: 'full-spot-overlay',
        customModal: 'full-spot-container',
        customCloseButton: 'full-spot-close-button',
    };

    return (
        <Modal open={open} onClose={onClose} closable customClassNames={classNames} container={container}>
            <div id="map-full-spot-popup">
                <header id="map-full-spot-popup-nav-container">
                    <MapFullSpotNav />
                </header>
                <main id="map-full-spot-popup-main-container">
                    <MapFullSpotMain />
                </main>
            </div>
        </Modal>
    );
};

export default MapFullSpot;
