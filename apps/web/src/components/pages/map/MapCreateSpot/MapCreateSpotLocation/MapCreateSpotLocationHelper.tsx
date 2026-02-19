import React from 'react';
import classnames from 'classnames';

import Typography from '@/components/Ui/typography/Typography';
import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary/ButtonPrimary';

type Props = {
    isMobile: boolean;
    handleToggleMapVisible: () => void;
    isPinPlaced?: boolean;
    isFlashing: boolean;
};

const MapCreateSpotLocationHelper = ({ isMobile, handleToggleMapVisible, isPinPlaced, isFlashing }: Props) => {
    return (
        <>
            <div
                className={classnames(
                    'absolute inline-block right-[calc(50%-9.5rem)] py-3 px-8 mt-8 text-onDark-highEmphasis bg-tertiary-dark border border-tertiary-medium shadow-onDarkHighSharp rounded transition-all duration-100 laptop-s:right-[calc((100%-24rem-1.5rem)/2-9.5rem)] laptop-s:mt-16',
                    {
                        'text-map-private-default border-map-private-default': isFlashing,
                    },
                )}
            >
                <Typography>Tap on the map to place the spot</Typography>
            </div>
            {isMobile && isPinPlaced && (
                <ButtonPrimary
                    className="absolute bottom-8 right-[calc(50%-5.5rem)]"
                    onClick={handleToggleMapVisible}
                >
                    Save location
                </ButtonPrimary>
            )}
        </>
    );
};

export default React.memo(MapCreateSpotLocationHelper);
