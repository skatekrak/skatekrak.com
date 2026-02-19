import React from 'react';

import Typography from '@/components/Ui/typography/Typography';
import IconPlus from '@/components/Ui/Icons/IconPlus';
import IconEdit from '@/components/Ui/Icons/IconEdit';

import { useField } from 'formik';
import { useQuery } from '@tanstack/react-query';
import Feudartifice from '@/shared/feudartifice';

type Props = {
    handleToggleMapVisible: () => void;
};

const MapCreateSpotLocation = ({ handleToggleMapVisible }: Props) => {
    const [{ value }] = useField<{ latitude: number | undefined; longitude: number | undefined }>('location');

    const { data } = useQuery({
        queryKey: ['fetch-reverser-geocoder', value],
        queryFn: async () => {
            if (value != null && value.latitude != null && value.longitude != null) {
                return Feudartifice.spots.reverseGeocoder({ latitude: value.latitude, longitude: value.longitude });
            }
        },
        enabled: value != null && value.latitude != null && value.longitude != null,
    });

    return (
        <button className="relative w-full p-6 text-left tablet:px-8 tablet:py-5" onClick={handleToggleMapVisible}>
            {value != null && value.latitude != null && value.longitude != null && data != null ? (
                <div className="flex">
                    <div className="mr-4 text-onDark-highEmphasis [&_.ui-Typography:last-child]:mt-1 [&_.ui-Typography:last-child]:uppercase">
                        <Typography>
                            {data.streetNumber} {data.streetName}
                        </Typography>
                        <Typography>
                            {data.city}, {data.country}
                        </Typography>
                    </div>
                    <div className="ml-auto text-onDark-mediumEmphasis">
                        <div className="flex items-center text-onDark-mediumEmphasis [&_.ui-Typography]:shrink-0 [&_svg]:shrink-0 [&_svg]:w-5 [&_svg]:ml-3 [&_svg]:fill-onDark-mediumEmphasis">
                            <Typography component="button">Edit</Typography>
                            <IconEdit />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-onDark-mediumEmphasis [&_div]:mb-2">
                    <div className="flex items-center text-onDark-mediumEmphasis [&_.ui-Typography]:shrink-0 [&_svg]:shrink-0 [&_svg]:w-5 [&_svg]:ml-3 [&_svg]:fill-onDark-mediumEmphasis">
                        <Typography component="button">Add location</Typography>
                        <IconPlus />
                    </div>
                    <Typography component="body2">Select a type to add location</Typography>
                </div>
            )}
        </button>
    );
};

export default MapCreateSpotLocation;
