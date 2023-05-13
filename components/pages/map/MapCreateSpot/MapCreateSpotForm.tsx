import { useFormikContext } from 'formik';
import { memo, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { MapCreateSpotFormValues } from './MapCreateSpot';
import MapCreateSpotLocationHelper from './MapCreateSpotLocation/MapCreateSpotLocationHelper';
import mapboxgl, { MapLayerMouseEvent } from 'mapbox-gl';

import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';
import * as S from './MapCreateSpot.styled';
import Arrow from 'components/Ui/Icons/Arrow';
import ScrollBar from 'components/Ui/Scrollbar';
import MapCreateSpotMedia from './MapCreateSpotMedia';
import MapCreateSpotType from './MapCreateSpotType';
import MapCreateSpotLocation from './MapCreateSpotLocation';
import MapCreateSpotRain from './MapCreateSpotRain';
import Typography from 'components/Ui/typography/Typography';
import { toggleCreateSpot } from 'store/map/slice';
import { useMap } from 'react-map-gl';

const MapCreateSpotForm = () => {
    const { handleSubmit, values, isSubmitting, isValid, dirty, setFieldValue } =
        useFormikContext<MapCreateSpotFormValues>();
    const isMobile = useAppSelector((state) => state.settings.isMobile);
    const [isMapVisible, setMapVisible] = useState(false);
    const dispatch = useAppDispatch();
    const [isLocationHelperFlashing, setIsLocationHelperFlashing] = useState(false);

    const { current: map } = useMap();

    useEffect(() => {
        const onClick = (event: MapLayerMouseEvent) => {
            event.preventDefault();
            setFieldValue('location', { latitude: event.lngLat.lat, longitude: event.lngLat.lng });
        };

        if (values.type != null) {
            map.on('click', onClick);
        }

        return () => {
            map.off('click', onClick);
        };
    }, [map, values.type]);

    useEffect(() => {
        let newSpotMaker: mapboxgl.Marker | null = null;
        if (values.location.latitude != null && values.location.longitude != null) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(/images/map/icons/${values.type}@2x.png)`;
            el.style.width = `48px`;
            el.style.height = `48px`;
            el.style.backgroundSize = '100%';

            newSpotMaker = new mapboxgl.Marker(el)
                .setLngLat([values.location.longitude, values.location.latitude])
                .addTo(map.getMap());
        }

        return () => {
            newSpotMaker?.remove();
        };
    }, [map, values.location, values.type]);

    const handleToggleMapVisible = () => {
        if (values.type != null) {
            setMapVisible((state) => !state);
        }

        setIsLocationHelperFlashing(true);

        setTimeout(() => {
            setIsLocationHelperFlashing(false);
        }, 200);
    };

    const toggleMapCreateSpot = useCallback(() => {
        dispatch(toggleCreateSpot());
    }, [dispatch]);

    return (
        <form onSubmit={handleSubmit}>
            {(isMapVisible || (!isMobile && values.type !== undefined)) && (
                <MapCreateSpotLocationHelper
                    isMobile={isMobile}
                    isPinPlaced={values.location.latitude !== undefined || values.location.longitude !== undefined}
                    handleToggleMapVisible={handleToggleMapVisible}
                    isFlashing={isLocationHelperFlashing}
                />
            )}
            <S.MapCreateSpotContainer isMapVisible={isMapVisible && isMobile}>
                <S.MapCreateSpotHeader>
                    <S.MapCreateSpotBackButton onClick={toggleMapCreateSpot}>
                        <Arrow />
                    </S.MapCreateSpotBackButton>
                    <Typography component="heading6">Create a spot</Typography>
                </S.MapCreateSpotHeader>

                <S.MapCreateSpotMain>
                    <ScrollBar maxHeight="100%">
                        {/* NAME */}
                        <S.MapCreateSpotName>
                            <S.MapCreateSpotInput name="name" placeholder="Name" autoFocus autoComplete="off" />
                        </S.MapCreateSpotName>
                        <S.MapCreateSpotMainDivider />

                        {/* TYPE */}
                        <MapCreateSpotType />
                        <S.MapCreateSpotMainDivider />

                        {/* LOCATION */}
                        <MapCreateSpotLocation handleToggleMapVisible={handleToggleMapVisible} />
                        <S.MapCreateSpotMainDivider />

                        {/* RAIN */}
                        <MapCreateSpotRain />
                        <S.MapCreateSpotMainDivider />

                        {/* MEDIA */}
                        <MapCreateSpotMedia />
                    </ScrollBar>
                </S.MapCreateSpotMain>
                <S.MapCreateSpotFooter>
                    <ButtonPrimary loading={isSubmitting} disabled={!isValid || isSubmitting || !dirty}>
                        Create
                    </ButtonPrimary>
                </S.MapCreateSpotFooter>
            </S.MapCreateSpotContainer>
        </form>
    );
};

export default memo(MapCreateSpotForm);
