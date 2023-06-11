import React from 'react';

import Category from '../components/Category';
import City from './City';
import * as S from './Cities.styled';

import cities from 'data/cities/_cities';

const category = {
    name: 'Cities',
    edito: 'Fly directly to some major cities for skateboarding.',
    displayedCityImage: 'paris',
};

const Cities = () => {
    return (
        <Category
            isSelected={false}
            faded={false}
            src={`/images/map/cities/${category.displayedCityImage}.jpg`}
            tooltipText={category.name}
            panelContent={(closePanel) => (
                <S.CitiesGrid>
                    {cities.map((city) => (
                        <City key={city.id} city={city} onCityClick={closePanel} />
                    ))}
                </S.CitiesGrid>
            )}
        />
    );
};

export default Cities;
