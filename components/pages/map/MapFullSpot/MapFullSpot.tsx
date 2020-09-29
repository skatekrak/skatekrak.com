import React from 'react';
import { useRouter } from 'next/router';

import Modal from 'components/Ui/Modal';

type MapFullSpotProps = {
    open: boolean;
    onClose: () => void;
    container: Element | undefined;
};

const MapFullSpot: React.FC<MapFullSpotProps> = ({ open, onClose, container }) => {
    const router = useRouter();

    let classNames = {
        customOverlay: 'full-spot-overlay',
        customModal: 'full-spot-container',
        customCloseButton: 'full-spot-close-button',
    };

    return (
        <Modal open={open} onClose={onClose} closable customClassNames={classNames} container={container}>
            <div id="map-full-spot-popup">
                <div id="map-full-spot-popup-nav">Nav</div>
                <div id="map-full-spot-popup-main">Main</div>
            </div>
        </Modal>
    );
};

export default MapFullSpot;
