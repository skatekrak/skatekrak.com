import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Modal from 'components/Ui/Modal';
import MapFullSpotNav from './MapFullSpotNav';
import MapFullSpotMain from './MapFullSpotMain';
import MapFullSpotCarousel from './MapFullSpotCarousel';
import * as S from './MapFullSpot.styled';

import { selectFullSpotTab } from 'store/map/slice';
import { useAppSelector } from 'store/hook';

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
    const [mediaId, spotOverview] = useAppSelector((state) => [state.map.media, state.map.spotOverview]);

    useEffect(() => {
        if (!open) {
            dispatch(selectFullSpotTab());
        }
    }, [open]);

    return (
        <Modal styles={modalStyles} open={open} container={container} onClose={onClose} closable closeIcon={undefined}>
            {spotOverview && (
                <S.MapFullSpotContainer>
                    {mediaId && <MapFullSpotCarousel initialMediaId={mediaId} spot={spotOverview.spot} />}
                    <S.MapFullSpotNavContainer>
                        <MapFullSpotNav />
                    </S.MapFullSpotNavContainer>
                    <S.MapFullSpotMainContainer>
                        <MapFullSpotMain />
                    </S.MapFullSpotMainContainer>
                </S.MapFullSpotContainer>
            )}
        </Modal>
    );
};

export default MapFullSpot;
