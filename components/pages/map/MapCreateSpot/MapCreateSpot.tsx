import React, { useState } from 'react';

import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';
import Arrow from 'components/Ui/Icons/Arrow';
import Typography from 'components/Ui/typography/Typography';
import ScrollBar from 'components/Ui/Scrollbar';
import MapCreateSpotType from './MapCreateSpotType';
import MapCreateSpotLocation from './MapCreateSpotLocation';
import MapCreateSpotRain from './MapCreateSpotRain';
import * as S from './MapCreateSpot.styled';

import { AddSpotParam } from 'shared/feudartifice/spots';
import { Types, Location } from 'shared/feudartifice/types';
import MapCreateSpotMedia from './MapCreateSpotMedia';
import MapCreateSpotLocationHelper from './MapCreateSpotLocation/MapCreateSpotLocationHelper';

type Props = {
    isMobile: boolean;
    onBackClick: () => void;
};

const MapCreateSpot = ({ isMobile, onBackClick }: Props) => {
    /** Name */
    const [name, setName] = useState('');

    const handleSetName = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setName(evt.target.value);
    };

    /** Type */
    const [type, setType] = useState<Types | undefined>(undefined);

    const handleTypeClick = (type: Types) => {
        setType(type);
    };

    /** Location */
    const [isMapVisisble, setIsMapVisible] = useState(false);
    const [isLocationHelperFlashing, setIsLocationHelperFlashing] = useState(false);

    const handleToggleMapVisible = () => {
        if (type !== undefined) {
            setIsMapVisible(!isMapVisisble);
        }

        setIsLocationHelperFlashing(true);

        setTimeout(() => {
            setIsLocationHelperFlashing(false);
        }, 200);
    };

    const [location, setLocation] = useState<Location | undefined>(undefined);

    const handleSetLocation = () => {
        if (type !== undefined) {
            setLocation({
                streetName: 'Passeig de Lluís Companys',
                streetNumber: '9999',
                city: 'Barcelona',
                country: 'Spain',
                latitude: 48.862725,
                longitude: 2.287592,
            });
        }
    };

    /** Rain */
    const [isRainSafe, setIsRainSafe] = useState(false);

    const handleRainChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.value === 'outdoor') {
            setIsRainSafe(false);
        }
        if (evt.target.value === 'indoor') {
            setIsRainSafe(true);
        }
    };

    /** Media */
    const [media, setMedia] = useState<string[]>([]);

    const handleAddMedia = (image: string) => {
        const newMedia = media.concat(image);
        setMedia(newMedia);
    };

    const handleRemoveMedia = (image: string) => {
        const newMedia = media.filter((img) => img !== image);
        setMedia(newMedia);
    };

    /** Api call */
    const isvalidSpot = name.length !== 0 && location !== undefined && type !== undefined && media.length !== 0;

    const req: AddSpotParam = {
        name,
        type,
        latitude: location && location.latitude,
        longitude: location && location.longitude,
        indoor: isRainSafe,
        // TODO: add media
    };

    const isLoading = false;

    return (
        <>
            {(isMapVisisble || (!isMobile && type !== undefined)) && (
                <MapCreateSpotLocationHelper isFlashing={isLocationHelperFlashing} />
            )}
            <S.MapCreateSpotContainer isMapVisible={isMapVisisble && isMobile}>
                <S.MapCreateSpotHeader>
                    <S.MapCreateSpotBackButton onClick={onBackClick}>
                        <Arrow />
                    </S.MapCreateSpotBackButton>
                    <Typography component="heading6">Create a spot</Typography>
                </S.MapCreateSpotHeader>

                <S.MapCreateSpotMain>
                    <ScrollBar maxHeight="100%">
                        {/* NAME */}
                        <S.MapCreateSpotName>
                            <S.MapCreateSpotInput placeholder="Name" value={name} onChange={handleSetName} autoFocus />
                        </S.MapCreateSpotName>
                        <S.MapCreateSpotMainDivider />

                        {/* TYPE */}
                        <MapCreateSpotType type={type} handleTypeClick={handleTypeClick} />
                        <S.MapCreateSpotMainDivider />

                        {/* LOCATION */}
                        <MapCreateSpotLocation
                            location={location}
                            handleSetLocation={handleSetLocation}
                            handleToggleMapVisible={handleToggleMapVisible}
                        />
                        <S.MapCreateSpotMainDivider />

                        {/* RAIN */}
                        <MapCreateSpotRain isRainSafe={isRainSafe} handleRainChange={handleRainChange} />
                        <S.MapCreateSpotMainDivider />

                        {/* MEDIA */}
                        <MapCreateSpotMedia
                            media={media}
                            handleAddMedia={handleAddMedia}
                            handleRemoveMedia={handleRemoveMedia}
                        />
                    </ScrollBar>
                </S.MapCreateSpotMain>
                <S.MapCreateSpotFooter>
                    <ButtonPrimary loading={isLoading} disabled={!isvalidSpot}>
                        Create
                    </ButtonPrimary>
                </S.MapCreateSpotFooter>
            </S.MapCreateSpotContainer>
        </>
    );
};

export default MapCreateSpot;
