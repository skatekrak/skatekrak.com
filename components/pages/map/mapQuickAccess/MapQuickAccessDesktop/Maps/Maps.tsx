import React from 'react';
import { useRouter } from 'next/router';

import Category from '../components/Category';
import Map from './Map';
import * as S from './Maps.styled';

import { QuickAccessMap, Category as TCategory } from '../../types';
import { useCustomMaps } from 'lib/hook/use-custom-map';
import { generateCategories } from '../../utils';

const isCategorySelected = (category: TCategory, mapId: string | string[]) =>
    category.maps.some((map) => map.id === mapId);

const sortMaps = (maps: QuickAccessMap[]) => maps.sort((a, b) => b.numberOfSpots - a.numberOfSpots);

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
                        src={`/images/map/custom-maps/${sortMaps(category.maps)[0].id}.png`}
                        tooltipText={category.name}
                        panelContent={(closePanel) => (
                            <S.MapsContainer>
                                <S.MapsCategoryTitle component="condensedHeading5">{category.name}</S.MapsCategoryTitle>
                                <S.Maps>
                                    {sortMaps(category.maps).map((map) => (
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
