import React, { useState } from 'react';
import { Types } from 'shared/feudartifice/types';

import IconEdit from 'components/Ui/Icons/IconEdit';
import IconPlus from 'components/Ui/Icons/IconPlus';
import Street from 'components/pages/map/marker/icons/Street';
import Park from 'components/pages/map/marker/icons/Park';
import Shop from 'components/pages/map/marker/icons/Shop';
import Private from 'components/pages/map/marker/icons/Private';
import Diy from 'components/pages/map/marker/icons/Diy';
import Typography from 'components/Ui/typography/Typography';
import * as S from './MapCreateSpotType.styled';
import * as SM from '../MapCreateSpot.styled';
import { useField } from 'formik';

const MapCreateSpotType = () => {
    const [{ value: type }, , helpers] = useField<Types>('type');
    const [isSelectTypeOpen, setIsSelectTypeOpen] = useState(false);

    const handleTypeBarClick = () => setIsSelectTypeOpen(!isSelectTypeOpen);

    const onTypeClick = (type: Types) => {
        helpers.setValue(type);
        setIsSelectTypeOpen(false);
    };

    return (
        <>
            <S.MapCreateSpotTypeMain onClick={handleTypeBarClick}>
                {type != null ? (
                    <>
                        <S.MapCreateSpotTypeSelected>
                            {type === 'street' && <Street />}
                            {type === 'park' && <Park />}
                            {type === 'shop' && <Shop />}
                            {type === 'private' && <Private />}
                            {type === 'diy' && <Diy />}
                            <Typography component="heading6">{type}</Typography>
                        </S.MapCreateSpotTypeSelected>
                        <SM.MapCreateSpotIconButton as="div">
                            <Typography component="button">Edit</Typography>
                            <IconEdit />
                        </SM.MapCreateSpotIconButton>
                    </>
                ) : (
                    <SM.MapCreateSpotIconButton as="div">
                        <Typography component="button">Select type</Typography>
                        <IconPlus />
                    </SM.MapCreateSpotIconButton>
                )}
            </S.MapCreateSpotTypeMain>
            {isSelectTypeOpen && (
                <S.MapCreateSpotTypeSelection>
                    <S.MapCreateSpotTypeSelectionButton
                        onClick={() => onTypeClick(Types.Street)}
                        isSelected={type === Types.Street}
                    >
                        <Street />
                        <Typography component="caption">Street</Typography>
                    </S.MapCreateSpotTypeSelectionButton>
                    <S.MapCreateSpotTypeSelectionButton
                        onClick={() => onTypeClick(Types.Park)}
                        isSelected={type === Types.Park}
                    >
                        <Park />
                        <Typography component="caption">Park</Typography>
                    </S.MapCreateSpotTypeSelectionButton>
                    <S.MapCreateSpotTypeSelectionButton
                        onClick={() => onTypeClick(Types.Shop)}
                        isSelected={type === Types.Shop}
                    >
                        <Shop />
                        <Typography component="caption">Shop</Typography>
                    </S.MapCreateSpotTypeSelectionButton>
                    <S.MapCreateSpotTypeSelectionButton
                        onClick={() => onTypeClick(Types.Private)}
                        isSelected={type === Types.Private}
                    >
                        <Private />
                        <Typography component="caption">Private</Typography>
                    </S.MapCreateSpotTypeSelectionButton>
                    <S.MapCreateSpotTypeSelectionButton
                        onClick={() => onTypeClick(Types.Diy)}
                        isSelected={type === Types.Diy}
                    >
                        <Diy />
                        <Typography component="caption">Diy</Typography>
                    </S.MapCreateSpotTypeSelectionButton>
                </S.MapCreateSpotTypeSelection>
            )}
        </>
    );
};

export default MapCreateSpotType;
