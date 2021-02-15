import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import type { QuickAccess } from 'components/pages/map/MapQuickAccess/MapQuickAccess';
import MapQuickAccessItem from '../MapQuickAccessItem';

const city: QuickAccess = {
    id: 'paris',
    name: 'Cities',
    edito: 'A portal to every major cities in skateboarding',
};

type Props = {
    isCitiesOpen: boolean;
    onCitiesClick: (e: React.SyntheticEvent) => void;
};

const MapQuickAccessCity = ({ onCitiesClick }: Props) => {
    const router = useRouter();

    const isNoMapSelected = useMemo(() => {
        return router.query.id !== undefined;
    }, [router.query.id]);

    return <MapQuickAccessItem noMapSelected={isNoMapSelected} onClick={onCitiesClick} data={city} />;
};

export default MapQuickAccessCity;
