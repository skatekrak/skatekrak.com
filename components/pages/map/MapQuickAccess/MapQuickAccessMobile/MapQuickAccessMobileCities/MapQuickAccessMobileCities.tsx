import React, { Ref, useMemo } from 'react';
import { useRouter } from 'next/router';

import * as S from './MapQuickAccessMobileCities.styled';

type Props = {
    isOpen: boolean;
    onCitiesClick: (e: React.SyntheticEvent) => void;
    ref?: Ref<HTMLDivElement>;
};

const MapQuickAccessMobileCities: React.FC<Props> = React.forwardRef((props, ref) => {
    const { isOpen, onCitiesClick } = props;
    const router = useRouter();

    const isNoMapSelected = useMemo(() => {
        return router.query.id !== undefined;
    }, [router.query.id]);

    return (
        <S.MapQuickAccessMobileCitiesContainer ref={ref} isOpen={isOpen}>
            <p>cities</p>
        </S.MapQuickAccessMobileCitiesContainer>
    );
});

MapQuickAccessMobileCities.displayName = 'MapQuickAccessMobileCities';

export default MapQuickAccessMobileCities;
