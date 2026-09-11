import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

import { cn } from '@krak/ui';

import { mapPanelOffset } from '@/components/pages/map/_components';
import KrakAppIcon from '@/components/Ui/Icons/Logos/KrakAppIcon';
import Typography from '@/components/Ui/typography/Typography';
import { useMapStore } from '@/store/map';

import MobileCities from '../mapQuickAccess/mobile/mobile-cities';
import MobileFamous from '../mapQuickAccess/mobile/mobile-famous';
import MobileMaps from '../mapQuickAccess/mobile/mobile-maps';
import Legend from './Legend';
import MapBottomNavSheet from './MapBottomNavSheet';

type Props = {
    isMobile: boolean;
};

const MapBottomNav: React.FC<Props> = ({ isMobile }) => {
    const isSidePanelOpen = useMapStore((state) => state.isSidePanelOpen);
    const offsetForPanel = !isMobile && isSidePanelOpen;

    return (
        <div
            className={cn(
                'absolute left-4 bottom-4 laptop-s:left-6 laptop-s:bottom-6 z-1000',
                offsetForPanel && mapPanelOffset,
            )}
        >
            <div className="flex flex-col mobile:flex-row gap-2">
                {/* Legend */}
                <MapBottomNavSheet title="Explore the map" maxWidth="27rem" render={() => <Legend />}>
                    <TriggerButton>
                        <KrakAppIcon className="max-tablet:hidden w-7 h-7 mr-4 shadow-none" />
                        <Typography component="condensedButton">Legend</Typography>
                    </TriggerButton>
                </MapBottomNavSheet>
                {isMobile && (
                    <>
                        {/* Cities */}
                        <MapBottomNavSheet
                            title="Cities"
                            maxWidth="24rem"
                            render={({ close }) => <MobileCities closeSheet={close} />}
                        >
                            <TriggerButton>
                                <Typography component="condensedButton">Cities</Typography>
                            </TriggerButton>
                        </MapBottomNavSheet>
                        {/* Maps */}
                        <MapBottomNavSheet
                            displayCloseButton={false}
                            maxWidth="24rem"
                            render={({ close }) => <MobileMaps closeSheet={close} />}
                        >
                            <TriggerButton>
                                <Typography component="condensedButton">Maps</Typography>
                            </TriggerButton>
                        </MapBottomNavSheet>
                        {/* Famous */}
                        <MobileFamous />
                    </>
                )}
            </div>
        </div>
    );
};

export default React.memo(MapBottomNav);

const TriggerButton = ({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={classNames(
            'flex items-center w-fit py-3 px-4 text-onDark-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-onDarkHighSharp',
            className,
        )}
        {...props}
    >
        {children}
    </button>
);
