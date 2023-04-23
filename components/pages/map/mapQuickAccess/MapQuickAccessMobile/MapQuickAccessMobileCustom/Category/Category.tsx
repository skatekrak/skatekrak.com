import React, { useState } from 'react';

import Map from '../../../MapQuickAccessDesktop/Maps/Map';
import * as S from './Category.styled';

import { Category as TCategory } from '../../../types';
import ArrowHead from 'components/Ui/Icons/ArrowHead';

type Props = {
    category: TCategory;
    onMapClick: () => void;
};

const Category = ({ category, onMapClick }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    console.log(category);
    return (
        <S.Category>
            <S.CategoryToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
                <S.CategoryName component="condensedHeading6">{category.name}</S.CategoryName>
                <ArrowHead />
            </S.CategoryToggleButton>
            {isOpen && (
                <S.MapsContainer>
                    {category.maps.map((map) => (
                        <Map
                            key={map.id}
                            map={map}
                            onClick={() => {
                                setIsOpen(false);
                                onMapClick();
                            }}
                        />
                    ))}
                </S.MapsContainer>
            )}
        </S.Category>
    );
};

export default Category;
