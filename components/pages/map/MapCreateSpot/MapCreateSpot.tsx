import React, { useState, memo } from 'react';
import * as Yup from 'yup';
import { Types, Location } from 'shared/feudartifice/types';
import { Formik } from 'formik';
import MapCreateSpotForm from './MapCreateSpotForm';
import Feudartifice from 'shared/feudartifice';
import to from 'await-to-js';
import { useAppDispatch } from 'store/hook';
import { selectSpot, toggleCreateSpot } from 'store/map/slice';
import { useQueryClient } from 'react-query';

export type MapCreateSpotFormValues = {
    name: string;
    type?: Types;
    location: {
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
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const onSubmit = async (values: MapCreateSpotFormValues) => {
        const [errorAddingSpot, spot] = await to(
            Feudartifice.spots.addSpot({
                name: values.name,
                type: values.type,
                ...values.location,
                indoor: values.indoor === 'true',
            }),
        );

        if (errorAddingSpot) {
            console.error('Error adding spot', errorAddingSpot);
            return;
        }

        if (spot == null) {
            console.error('Empty spot');
            return;
        }

        const [errorAddMedia, medias] = await to(
            Promise.all(
                values.images.map(async (imageURL) => {
                    const media = await Feudartifice.media.createMedia({ spot: spot.id });
                    return Feudartifice.media.uploadMedia(media.id, imageURL);
                }),
            ),
        );

        dispatch(toggleCreateSpot());
        dispatch(selectSpot(spot.id));
        queryClient.invalidateQueries(['fetch-spots-on-map']);
    };

    return (
        <Formik
            initialValues={mapCreateSpotSchema.getDefault()}
            onSubmit={onSubmit}
            validationSchema={mapCreateSpotSchema}
        >
            <MapCreateSpotForm />
        </Formik>
    );
};

export default memo(MapCreateSpot);
