import React, { useEffect } from 'react';

import Modal from '@/components/Ui/Modal';
import MapFullSpotNav from './MapFullSpotNav';
import MapFullSpotMain from './MapFullSpotMain';
import MapFullSpotCarousel from './MapFullSpotCarousel';
import * as S from './MapFullSpot.styled';

import { useMapStore } from '@/store/map';
import { modalThemeStyles } from '@/components/Ui/Modal/styles';
import { useFullSpotSelectedTab, useMediaID } from '@/lib/hook/queryState';

type MapFullSpotProps = {
    open: boolean;
    onClose: () => void;
    container?: Element | null;
};

const MapFullSpot: React.FC<MapFullSpotProps> = ({ open, onClose, container }) => {
    const spotOverview = useMapStore((state) => state.spotOverview);
    const [mediaId] = useMediaID();
    const [, selectFullSpotTab] = useFullSpotSelectedTab();

    useEffect(() => {
        if (!open) {
            selectFullSpotTab(null);
        }
    }, [open, selectFullSpotTab]);

    return (
        <Modal
            styles={modalThemeStyles}
            open={open}
            container={container}
            onClose={onClose}
            closable
            closeIcon={undefined}
        >
            {spotOverview && (
                <S.MapFullSpotContainer isCarouselOpen={!!mediaId}>
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
