import React, { useEffect } from 'react';

import Modal from 'components/Ui/Modal';
import MapFullSpotNav from './MapFullSpotNav';
import MapFullSpotMain from './MapFullSpotMain';
import * as S from './MapFullSpot.styled';

import { useDispatch } from 'react-redux';
import { selectFullSpotTab } from 'store/map/slice';

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
    const dispatch = useDispatch();
    useEffect(() => {
        if (!open) {
            dispatch(selectFullSpotTab());
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} closable customClassNames={classNames} container={container}>
            <S.MapFullSpotContainer>
                <S.MapFullSpotNavContainer>
                    <MapFullSpotNav />
                </S.MapFullSpotNavContainer>
                <S.MapFullSpotMainContainer>
                    <MapFullSpotMain />
                </S.MapFullSpotMainContainer>
            </S.MapFullSpotContainer>
        </Modal>
    );
};

export default MapFullSpot;
