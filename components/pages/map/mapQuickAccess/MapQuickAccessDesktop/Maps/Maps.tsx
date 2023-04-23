import React from 'react';
import { useRouter } from 'next/router';

import Category from '../components/Category';
import Map from './Map';
import * as S from './Maps.styled';

import { CustomMapCategory, QuickAccessMap, Category as TCategory } from '../../types';
import { useCustomMaps } from 'lib/hook/use-custom-map';
import { generateCustomMapSrcSet } from '../../utils';

export const generateCategories = (data: QuickAccessMap[]): TCategory[] => {
    const categories: CustomMapCategory[] = data.reduce((acc, value) => acc.concat(value.categories), []);
    const uniqueCategories: CustomMapCategory[] = categories.filter(
        (category, i, a) => a.findIndex((v) => v === category) === i,
    );

    return uniqueCategories.map((category) => ({
        id: category,
        name: CustomMapCategory[category],
        maps: data.filter((map) => map.categories.some((cat) => cat === category)),
    }));
};

export const isCategorySelected = (category: TCategory, mapId: string | string[]) =>
    category.maps.some((map) => map.id === mapId);

const Maps = () => {
    const router = useRouter();

    const { isLoading, data } = useCustomMaps();

    return (
        <>
            {!isLoading &&
                data &&
                generateCategories(data).map((category) => (
                    <Category
                        key={category.id}
                        isSelected={isCategorySelected(category, router.query.id)}
                        faded={false}
                        src={`/images/map/custom-maps${category.maps[0].id}.png`}
                        srcSet={generateCustomMapSrcSet(category.maps[0].id)}
                        tooltipText={category.name}
                        panelContent={(closePanel) => (
                            <S.MapsContainer>
                                <S.MapsCategoryTitle component="condensedHeading5">{category.name}</S.MapsCategoryTitle>
                                <S.Maps>
                                    {category.maps.map((map) => (
                                        <Map key={map.id} map={map} onClick={closePanel} />
                                    ))}
                                </S.Maps>
                            </S.MapsContainer>
                        )}
                    />
                ))}
        </>
    );
};

export default Maps;
