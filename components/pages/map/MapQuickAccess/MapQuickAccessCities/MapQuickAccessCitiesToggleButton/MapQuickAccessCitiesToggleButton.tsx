import React, { Ref, useMemo } from 'react';
import { useRouter } from 'next/router';

import MapQuickAccessItem from '../../MapQuickAccessItem';
import * as S from '../MapQuickAccessCities.styled';

import type { QuickAccess } from 'components/pages/map/MapQuickAccess/MapQuickAccess';

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

const MapQuickAccessCitiesToggleButton: React.FC<Props> = React.forwardRef((props, ref) => {
    const { onCitiesClick, isCitiesOpen } = props;
    const router = useRouter();

    const isNoMapSelected = useMemo(() => {
        return router.query.id !== undefined;
    }, [router.query.id]);

    return (
        <S.MapQuickAccessCitiesToggleButton ref={ref} isOpen={isCitiesOpen}>
            <MapQuickAccessItem noMapSelected={isNoMapSelected} onClick={onCitiesClick} data={city} />
        </S.MapQuickAccessCitiesToggleButton>
    );
});

MapQuickAccessCitiesToggleButton.displayName = 'MapQuickAccessCitiesToggleButton';

export default MapQuickAccessCitiesToggleButton;
