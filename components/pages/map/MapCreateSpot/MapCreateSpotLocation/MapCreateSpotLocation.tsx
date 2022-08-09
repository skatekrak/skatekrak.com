import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import IconPlus from 'components/Ui/Icons/IconPlus';
import IconEdit from 'components/Ui/Icons/IconEdit';
import * as S from './MapCreateSpotLocation.styled';
import * as SM from '../MapCreateSpot.styled';

import { useField } from 'formik';
import { useQuery } from '@tanstack/react-query';
import Feudartifice from 'shared/feudartifice';

type Props = {
    handleToggleMapVisible: () => void;
};

const MapCreateSpotLocation = ({ handleToggleMapVisible }: Props) => {
    const [{ value }] = useField<{ latitude: number | undefined; longitude: number | undefined }>('location');

    const { data } = useQuery(
        ['fetch-reverser-geocoder', value],
        async () => {
            return Feudartifice.spots.reverseGeocoder({ latitude: value.latitude, longitude: value.longitude });
        },
        {
            enabled: value.latitude != null && value.longitude != null,
        },
    );

    return (
        <S.MapCreateSpotLocationContainer onClick={handleToggleMapVisible}>
            {value.latitude != null && value.longitude != null && data != null ? (
                <S.MapCreateSpotLocationAddressContainer>
                    <S.MapCreateSpotLocationAddress>
                        <Typography>
                            {data.streetNumber} {data.streetName}
                        </Typography>
                        <Typography>
                            {data.city}, {data.country}
                        </Typography>
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
