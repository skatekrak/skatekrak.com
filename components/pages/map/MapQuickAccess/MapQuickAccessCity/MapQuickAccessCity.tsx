import React, { Ref, useMemo } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import type { QuickAccess } from 'components/pages/map/MapQuickAccess/MapQuickAccess';
import MapQuickAccessItem from '../MapQuickAccessItem';

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

const MapQuickAccessCity: React.FC<Props> = React.forwardRef((props, ref) => {
    const { onCitiesClick, isCitiesOpen } = props;
    const router = useRouter();

    const isNoMapSelected = useMemo(() => {
        return router.query.id !== undefined;
    }, [router.query.id]);

    return (
        <div ref={ref} className={classNames('map-quick-access-city', { 'map-quick-access-city--open': isCitiesOpen })}>
            <MapQuickAccessItem noMapSelected={isNoMapSelected} onClick={onCitiesClick} data={city} />
        </div>
    );
});

MapQuickAccessCity.displayName = 'MapQuickAccessCity';

export default MapQuickAccessCity;
