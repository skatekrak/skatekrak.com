import React, { useEffect } from 'react';

import Modal from 'components/Ui/Modal';
import MapFullSpotNav from './MapFullSpotNav';
import MapFullSpotMain from './MapFullSpotMain';
import * as S from './MapFullSpot.styled';

import { useDispatch } from 'react-redux';
import { selectFullSpotTab } from 'store/map/slice';

const modalStyles = {
    overlay: S.MapFullSpotModalOverlayStyles,
    modal: S.MapFullSpotModalStyles,
    closeButton: S.MapFullSpotModalCloseButtonStyles,
    closeIcon: S.MapFullSpotModalCloseIconStyles,
};

type MapFullSpotProps = {
    open: boolean;
    onClose: () => void;
    container?: Element;
};

const MapFullSpot: React.FC<MapFullSpotProps> = ({ open, onClose, container }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!open) {
            dispatch(selectFullSpotTab());
        }
    }, [open]);

    return (
        <Modal styles={modalStyles} open={open} container={container} onClose={onClose} closable closeIcon={undefined}>
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
