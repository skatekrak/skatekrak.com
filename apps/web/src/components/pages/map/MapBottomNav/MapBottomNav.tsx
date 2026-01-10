import React, { ButtonHTMLAttributes } from 'react';

import Typography from '@/components/Ui/typography/Typography';
import KrakAppIcon from '@/components/Ui/Icons/Logos/KrakAppIcon';
import Legend from '@/components/pages/map/Legend';
import MapBottomNavSheet from './MapBottomNavSheet';
import MobileCities from '../mapQuickAccess/mobile/mobile-cities';
import MobileMaps from '../mapQuickAccess/mobile/mobile-maps';

type Props = {
    isMobile: boolean;
};

const MapBottomNav: React.FC<Props> = ({ isMobile }) => {
    return (
        <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6 flex items-cente gap-2 z-[1000]">
            {/* Legend */}
            <MapBottomNavSheet title="Explore the map" maxWidth="27rem" render={() => <Legend />}>
                <TriggerButton>
                    <KrakAppIcon className="w-7 h-7 mr-4 shadow-none" />
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
                </>
            )}
        </div>
    );
};

export default React.memo(MapBottomNav);

const TriggerButton = ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className="flex items-center min-h-[3.5rem] py-2.5 px-4 text-onDark-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-onDarkHighSharp"
        {...props}
    >
        {children}
    </button>
);
