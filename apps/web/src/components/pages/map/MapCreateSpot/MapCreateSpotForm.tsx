import { useFormikContext, Field } from 'formik';
import mapboxgl, { MapLayerMouseEvent } from 'mapbox-gl';
import { memo, useEffect, useState } from 'react';
import { useMap } from 'react-map-gl';
import classnames from 'classnames';

import { useMapStore } from '@/store/map';
import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary';
import Arrow from '@/components/Ui/Icons/Arrow';
import ScrollBar from '@/components/Ui/Scrollbar';
import Typography from '@/components/Ui/typography/Typography';
import { MapCreateSpotFormValues } from './MapCreateSpot';
import MapCreateSpotLocation from './MapCreateSpotLocation';
import MapCreateSpotLocationHelper from './MapCreateSpotLocation/MapCreateSpotLocationHelper';
import MapCreateSpotMedia from './MapCreateSpotMedia';
import MapCreateSpotRain from './MapCreateSpotRain';
import MapCreateSpotType from './MapCreateSpotType';
import { useSettingsStore } from '@/store/settings';

const MapCreateSpotForm = () => {
    const { handleSubmit, values, isSubmitting, isValid, dirty, setFieldValue } =
        useFormikContext<MapCreateSpotFormValues>();
    const isMobile = useSettingsStore((state) => state.isMobile);
    const [isMapVisible, setMapVisible] = useState(false);
    const toggleCreateSpot = useMapStore((state) => state.toggleCreateSpot);
    const [isLocationHelperFlashing, setIsLocationHelperFlashing] = useState(false);

    const { current: map } = useMap();

    useEffect(() => {
        const onClick = (event: MapLayerMouseEvent) => {
            event.preventDefault();
            setFieldValue('location', { latitude: event.lngLat.lat, longitude: event.lngLat.lng });
        };

        if (values.type != null) {
            map?.on('click', onClick);
        }

        return () => {
            map?.off('click', onClick);
        };
    }, [map, values.type, setFieldValue]);

    useEffect(() => {
        let newSpotMaker: mapboxgl.Marker | null = null;
        if (values.location?.latitude != null && values.location.longitude != null) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(/images/map/icons/${values.type}@2x.png)`;
            el.style.width = `48px`;
            el.style.height = `48px`;
            el.style.backgroundSize = '100%';

            if (map != null) {
                newSpotMaker = new mapboxgl.Marker(el)
                    .setLngLat([values.location.longitude, values.location.latitude])
                    .addTo(map.getMap());
            }
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

    return (
        <form onSubmit={handleSubmit}>
            {(isMapVisible || (!isMobile && values.type !== undefined)) && (
                <MapCreateSpotLocationHelper
                    isMobile={isMobile}
                    isPinPlaced={values.location?.latitude !== undefined || values.location?.longitude !== undefined}
                    handleToggleMapVisible={handleToggleMapVisible}
                    isFlashing={isLocationHelperFlashing}
                />
            )}
            <div
                className={classnames(
                    'absolute top-0 left-0 right-0 bottom-0 flex flex-col w-full text-onDark-highEmphasis pointer-events-none [&_.icon-plus]:w-5 mobile:max-w-[24rem] mobile:top-4 mobile:left-4 mobile:bottom-4 laptop:top-6 laptop:left-6 laptop:bottom-6',
                    { hidden: isMapVisible && isMobile },
                )}
            >
                <div className="relative p-4 bg-tertiary-dark pointer-events-auto [&_button]:absolute [&_button]:left-4 [&_button]:top-[calc(50%-1.25rem)] [&_button_svg]:w-6 [&_button_svg]:fill-onDark-highEmphasis [&_button_svg]:rotate-180 [&_.ui-Typography]:text-center mobile:shadow-onDarkHighSharp">
                    <button className="flex p-2 z-[1]" onClick={() => toggleCreateSpot()}>
                        <Arrow />
                    </button>
                    <Typography component="heading6">Create a spot</Typography>
                </div>

                <div className="grow overflow-hidden bg-tertiary-medium pointer-events-auto mobile:grow-0 mobile:bg-tertiary-dark">
                    <ScrollBar maxHeight="100%">
                        {/* NAME */}
                        <div className="p-6 pb-8 tablet:px-8 tablet:py-6">
                            <Field
                                name="name"
                                placeholder="Name"
                                autoFocus
                                autoComplete="off"
                                className="w-full font-roboto-bold text-xl text-onDark-highEmphasis bg-inherit outline-none"
                            />
                        </div>
                        <div className="h-px w-full bg-onDark-divider" />

                        {/* TYPE */}
                        <MapCreateSpotType />
                        <div className="h-px w-full bg-onDark-divider" />

                        {/* LOCATION */}
                        <MapCreateSpotLocation handleToggleMapVisible={handleToggleMapVisible} />
                        <div className="h-px w-full bg-onDark-divider" />

                        {/* RAIN */}
                        <MapCreateSpotRain />
                        <div className="h-px w-full bg-onDark-divider" />

                        {/* MEDIA */}
                        <MapCreateSpotMedia />
                    </ScrollBar>
                </div>
                <div className="p-4 px-6 bg-tertiary-dark shadow-onDarkHighSharp pointer-events-auto z-[1] [&_button]:w-full">
                    <ButtonPrimary loading={isSubmitting} disabled={!isValid || isSubmitting || !dirty}>
                        Create
                    </ButtonPrimary>
                </div>
            </div>
        </form>
    );
};

export default memo(MapCreateSpotForm);
