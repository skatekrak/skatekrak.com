import React, { useState, memo } from 'react';
import * as Yup from 'yup';
import { Types, Location } from 'shared/feudartifice/types';
import { Formik } from 'formik';
import MapCreateSpotForm from './MapCreateSpotForm';

export type MapCreateSpotFormValues = {
    name: string;
    type?: Types;
    location?: {
        latitude: number;
        longitude: number;
    };
    indoor: 'true' | 'false'; // Forms with radio only handle string value
    images: string[];
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
        .of(Yup.string())
        .min(1, 'You must add at least 1 media')
        .default([])
        .required('You must add at least 1 media'),
});

const MapCreateSpot = () => {
    const onSubmit = async (values: MapCreateSpotFormValues) => {
        //
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
