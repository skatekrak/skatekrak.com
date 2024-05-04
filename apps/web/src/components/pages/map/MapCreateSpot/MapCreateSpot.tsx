import React, { memo } from 'react';
import * as Yup from 'yup';
import { Types } from '@/shared/feudartifice/types';
import { Formik } from 'formik';
import MapCreateSpotForm from './MapCreateSpotForm';
import Feudartifice from '@/shared/feudartifice';
import * as _ from 'radash';
import { useQueryClient } from '@tanstack/react-query';

import { useSpotID } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

export type MapCreateSpotFormValues = {
    name: string;
    type?: Types;
    location?: {
        latitude: number;
        longitude: number;
    };
    indoor: 'true' | 'false'; // Forms with radio only handle string value
    images: File[];
};

const mapCreateSpotSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Name must be at least 3 letters').required('You must fill a name').default(''),
    type: Yup.mixed<Types>().required(),
    location: Yup.object()
        .shape({
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
        })
        .required(),
    indoor: Yup.mixed().oneOf(['true', 'false']).default('false'),
    images: Yup.array()
        .of(Yup.mixed())
        .min(1, 'You must add at least 1 media')
        .default([])
        .required('You must add at least 1 media'),
});

const MapCreateSpot = () => {
    const toggleCreateSpot = useMapStore((state) => state.toggleCreateSpot);
    const queryClient = useQueryClient();
    const [, setSpotID] = useSpotID();

    const onSubmit = async (values: MapCreateSpotFormValues) => {
        const [errorAddingSpot, spot] = await _.try(Feudartifice.spots.addSpot)({
            name: values.name,
            type: values.type!,
            ...values.location!,
            indoor: values.indoor === 'true',
        });

        if (errorAddingSpot) {
            console.error('Error adding spot', errorAddingSpot);
            return;
        }

        if (spot == null) {
            console.error('Empty spot');
            return;
        }

        await _.try(_.parallel)(2, values.images, async (imageURL: File) => {
            const media = await Feudartifice.media.createMedia({ spot: spot.id });
            return Feudartifice.media.uploadMedia(media.id, imageURL);
        });

        toggleCreateSpot();
        setSpotID(spot.id);
        queryClient.invalidateQueries({ queryKey: ['fetch-spots-on-map'] });
    };

    return (
        <Formik
            initialValues={{
                name: '',
                type: undefined,
                location: undefined,
                indoor: 'false',
                images: [],
            }}
            onSubmit={onSubmit}
            validationSchema={mapCreateSpotSchema}
        >
            <MapCreateSpotForm />
        </Formik>
    );
};

export default memo(MapCreateSpot);
