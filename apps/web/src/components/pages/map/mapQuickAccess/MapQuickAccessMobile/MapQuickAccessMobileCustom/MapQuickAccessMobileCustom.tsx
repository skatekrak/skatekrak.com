import React from 'react';

import * as S from './MapQuickAccessMobileCustom.styled';

import Category from './Category';
import { generateCategories } from '../../utils';
import { trpc } from '@/server/trpc/utils';

type Props = {
    closeSheet: () => void;
};

const MapQuickAccessMobileCustom: React.FC<Props> = ({ closeSheet }) => {
    const { isLoading, data } = trpc.maps.list.useQuery();

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
