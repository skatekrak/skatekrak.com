import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import IconPlus from 'components/Ui/Icons/IconPlus';
import IconEdit from 'components/Ui/Icons/IconEdit';
import * as S from './MapCreateSpotLocation.styled';
import * as SM from '../MapCreateSpot.styled';

import { Location } from 'shared/feudartifice/types';

type Props = {
    location?: Location;
    handleSetLocation: () => void;
    handleToggleMapVisible: () => void;
};

const MapCreateSpotLocation = ({ handleSetLocation, location, handleToggleMapVisible }: Props) => {
    return (
        <S.MapCreateSpotLocationContainer onClick={handleToggleMapVisible}>
            {location ? (
                <S.MapCreateSpotLocationAddressContainer>
                    <S.MapCreateSpotLocationAddress>
                        <Typography>9999 Passeig de Lluís Companys</Typography>
                        <Typography>Barcelona, Spain</Typography>
                    </S.MapCreateSpotLocationAddress>
                    <S.MapCreateSpotEditLocation>
                        <SM.MapCreateSpotIconButton as="div">
                            <Typography component="button">Edit</Typography>
                            <IconEdit />
                        </SM.MapCreateSpotIconButton>
                    </S.MapCreateSpotEditLocation>
                </S.MapCreateSpotLocationAddressContainer>
            ) : (
                <S.MapCreateSpotAddLocation>
                    <SM.MapCreateSpotIconButton as="div">
                        <Typography component="button">Add location</Typography>
                        <IconPlus />
                    </SM.MapCreateSpotIconButton>
                    <Typography component="body2">Select a type to add location</Typography>
                </S.MapCreateSpotAddLocation>
            )}
        </S.MapCreateSpotLocationContainer>
    );
};

export default MapCreateSpotLocation;
