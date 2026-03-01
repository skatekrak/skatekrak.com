import { memo } from 'react';
import * as Yup from 'yup';
import { Types } from '@krak/carrelage-client';
import { Formik } from 'formik';
import MapCreateSpotForm from './MapCreateSpotForm';
import * as _ from 'radash';
import { useQueryClient } from '@tanstack/react-query';

import { client } from '@/server/orpc/client';
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
        const [errorCreating, spot] = await _.try(client.spots.create)({
            name: values.name,
            type: values.type!,
            ...values.location!,
            indoor: values.indoor === 'true',
        });

        if (errorCreating) {
            console.error('Error creating spot', errorCreating);
            return;
        }

        if (spot == null) {
            console.error('Empty spot');
            return;
        }

        await _.try(_.parallel)(2, values.images, async (imageFile: File) => {
            return client.media.uploadToSpot({ spotId: spot.id, file: imageFile });
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
