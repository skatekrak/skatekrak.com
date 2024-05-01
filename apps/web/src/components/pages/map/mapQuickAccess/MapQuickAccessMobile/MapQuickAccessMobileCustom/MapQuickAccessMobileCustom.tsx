import React from 'react';

import * as S from './MapQuickAccessMobileCustom.styled';

import { useCustomMaps } from '@/lib/hook/use-custom-map';
import Category from './Category';
import { generateCategories } from '../../utils';

type Props = {
    closeSheet: () => void;
};

const MapQuickAccessMobileCustom: React.FC<Props> = ({ closeSheet }) => {
    const { isLoading, data } = useCustomMaps();

    return (
        <S.MapQuickAccessMobileCustomContainer>
            {!isLoading &&
                data &&
                generateCategories(data).map((category) => (
                    <Category key={category.id} category={category} onMapClick={closeSheet} />
                ))}
        </S.MapQuickAccessMobileCustomContainer>
    );
};

export default MapQuickAccessMobileCustom;
