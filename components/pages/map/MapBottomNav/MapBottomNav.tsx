import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import KrakAppIcon from 'components/Ui/Icons/Logos/KrakAppIcon';
import Legend from 'components/pages/map/Legend';
import MapBottomNavSheet from './MapBottomNavSheet';
import MapQuickAccessMobileCities from '../mapQuickAccess/MapQuickAccessMobile/MapQuickAccessMobileCities';
import MapQuickAccessMobileCustom from '../mapQuickAccess/MapQuickAccessMobile/MapQuickAccessMobileCustom';
import * as S from './MapBottomNav.styled';

type Props = {
    isMobile: boolean;
};

const MapBottomNav: React.FC<Props> = ({ isMobile }) => {
    return (
        <S.MapBottomNavContainer>
            {/* Legend */}
            <MapBottomNavSheet title="Explore the map" maxWidth="27rem" render={() => <Legend />}>
                <S.MapBottomNavTriggerContainer>
                    <S.MapBottomNavQuickAccessTrigger>
                        <KrakAppIcon />
                        <Typography component="condensedButton">Legend</Typography>
                    </S.MapBottomNavQuickAccessTrigger>
                </S.MapBottomNavTriggerContainer>
            </MapBottomNavSheet>
            {isMobile && (
                <>
                    {/* Cities */}
                    <MapBottomNavSheet
                        title="Cities"
                        maxWidth="24rem"
                        render={({ close }) => <MapQuickAccessMobileCities closeSheet={close} />}
                    >
                        <S.MapBottomNavTriggerContainer>
                            <S.MapBottomNavQuickAccessTrigger>
                                <Typography component="condensedButton">Cities</Typography>
                            </S.MapBottomNavQuickAccessTrigger>
                        </S.MapBottomNavTriggerContainer>
                    </MapBottomNavSheet>
                    {/* Maps */}
                    <MapBottomNavSheet
                        displayCloseButton={false}
                        maxWidth="24rem"
                        render={({ close }) => <MapQuickAccessMobileCustom closeSheet={close} />}
                    >
                        <S.MapBottomNavTriggerContainer>
                            <S.MapBottomNavQuickAccessTrigger>
                                <Typography component="condensedButton">Maps</Typography>
                            </S.MapBottomNavQuickAccessTrigger>
                        </S.MapBottomNavTriggerContainer>
                    </MapBottomNavSheet>
                </>
            )}
        </S.MapBottomNavContainer>
    );
};

export default React.memo(MapBottomNav);
