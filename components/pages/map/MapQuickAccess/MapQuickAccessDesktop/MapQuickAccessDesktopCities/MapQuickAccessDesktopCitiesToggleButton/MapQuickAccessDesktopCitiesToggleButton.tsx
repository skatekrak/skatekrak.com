import React, { Ref, useMemo } from 'react';
import { useRouter } from 'next/router';

import MapQuickAccessDesktopItem from '../../MapQuickAccessDesktopItem';
import * as S from '../MapQuickAccessDesktopCities.styled';

import type { QuickAccess } from 'components/pages/map/mapQuickAccess/MapQuickAccessDesktop/MapQuickAccessDesktop';

const city: QuickAccess = {
    id: 'paris',
    name: 'Cities',
    edito: 'Fly directly to some major cities for skateboarding.',
};

type Props = {
    isCitiesOpen: boolean;
    onCitiesClick: (e: React.SyntheticEvent) => void;
    ref?: Ref<HTMLDivElement>;
};

const MapQuickAccessDesktopCitiesToggleButton: React.FC<Props> = React.forwardRef((props, ref) => {
    const { onCitiesClick, isCitiesOpen } = props;
    const router = useRouter();

    const isNoMapSelected = useMemo(() => {
        return router.query.id !== undefined;
    }, [router.query.id]);

    return (
        <S.MapQuickAccessDesktopCitiesToggleButton ref={ref} isOpen={isCitiesOpen}>
            <MapQuickAccessDesktopItem noMapSelected={isNoMapSelected} onClick={onCitiesClick} data={city} />
        </S.MapQuickAccessDesktopCitiesToggleButton>
    );
});

MapQuickAccessDesktopCitiesToggleButton.displayName = 'MapQuickAccessDesktopCitiesToggleButton';

export default MapQuickAccessDesktopCitiesToggleButton;
