import React, { useEffect } from 'react';
import classnames from 'classnames';

import Modal from '@/components/Ui/Modal';
import MapFullSpotNav from './MapFullSpotNav';
import MapFullSpotMain from './MapFullSpotMain';
import MapFullSpotCarousel from './MapFullSpotCarousel';

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
            customClassNames={{ customRoot: '!z-[1100]' }}
        >
            {spotOverview && (
                <div
                    className={classnames(
                        'relative flex flex-col min-h-screen overflow-hidden',
                        'tablet:grid tablet:grid-cols-[minmax(16rem,1fr)_3fr] tablet:[grid-template-areas:"fullSpotNav_fullSpotMain"] tablet:min-h-0 tablet:h-[40rem]',
                        'laptop:min-h-0 laptop:h-auto laptop:aspect-video laptop:w-[88vw] laptop:max-w-[80rem]',
                        mediaId ? 'h-screen' : 'h-auto',
                    )}
                >
                    {mediaId && <MapFullSpotCarousel initialMediaId={mediaId} spot={spotOverview.spot} />}
                    <header className="tablet:[grid-area:fullSpotNav] tablet:absolute tablet:top-0 tablet:right-0 tablet:bottom-0 tablet:left-0 tablet:border-r tablet:border-onDark-divider">
                        <MapFullSpotNav />
                    </header>
                    <main className="grow bg-tertiary-medium tablet:[grid-area:fullSpotMain] tablet:absolute tablet:top-0 tablet:right-0 tablet:bottom-0 tablet:left-0 tablet:overflow-hidden">
                        <MapFullSpotMain />
                    </main>
                </div>
            )}
        </Modal>
    );
};

export default MapFullSpot;
