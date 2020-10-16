import React from 'react';

import Typings from 'Types';

import Modal from 'components/Ui/Modal';
import MapFullSpotNav from './MapFullSpotNav';
import MapFullSpotMain from './MapFullSpotMain';
import { useSelector } from 'react-redux';

const classNames = {
    customOverlay: 'full-spot-overlay',
    customModal: 'full-spot-container',
    customCloseButton: 'full-spot-close-button',
};

type MapFullSpotProps = {
    open: boolean;
    onClose: () => void;
    container: Element | undefined;
};

const MapFullSpot: React.FC<MapFullSpotProps> = ({ open, onClose, container }) => {
    const { spotOverview } = useSelector((state: Typings.RootState) => state.map);
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
