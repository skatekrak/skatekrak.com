import React from 'react';
import { Field } from 'formik';

import Typography from '@/components/Ui/typography/Typography';

const MapCreateSpotRain = () => {
    return (
        <div className="flex items-center justify-between pl-6 tablet:pl-8">
            <Typography component="subtitle1">Rain safe?</Typography>
            <div className="flex items-center flex-wrap ml-6">
                <label className="flex items-center p-6 tablet:py-5 tablet:px-6 first-of-type:tablet:pr-4 last-of-type:tablet:pr-8 last-of-type:tablet:pl-4 [&_input[type='radio']]:appearance-none [&_input[type='radio']]:grid [&_input[type='radio']]:place-content-center [&_input[type='radio']]:bg-inherit [&_input[type='radio']]:m-0 [&_input[type='radio']]:mr-2 [&_input[type='radio']]:font-[inherit] [&_input[type='radio']]:text-current [&_input[type='radio']]:w-4 [&_input[type='radio']]:h-4 [&_input[type='radio']]:border [&_input[type='radio']]:border-current [&_input[type='radio']]:rounded-full [&_input[type='radio']]:cursor-pointer [&_input[type='radio']]:before:content-[''] [&_input[type='radio']]:before:w-2 [&_input[type='radio']]:before:h-2 [&_input[type='radio']]:before:scale-0 [&_input[type='radio']]:before:bg-primary-50 [&_input[type='radio']]:before:rounded-full [&_input[type='radio']:checked]:before:scale-[1.125]">
                    <Field type="radio" name="indoor" value="false" />
                    <Typography>Outdoor</Typography>
                </label>
                <label className="flex items-center p-6 tablet:py-5 tablet:px-6 first-of-type:tablet:pr-4 last-of-type:tablet:pr-8 last-of-type:tablet:pl-4 [&_input[type='radio']]:appearance-none [&_input[type='radio']]:grid [&_input[type='radio']]:place-content-center [&_input[type='radio']]:bg-inherit [&_input[type='radio']]:m-0 [&_input[type='radio']]:mr-2 [&_input[type='radio']]:font-[inherit] [&_input[type='radio']]:text-current [&_input[type='radio']]:w-4 [&_input[type='radio']]:h-4 [&_input[type='radio']]:border [&_input[type='radio']]:border-current [&_input[type='radio']]:rounded-full [&_input[type='radio']]:cursor-pointer [&_input[type='radio']]:before:content-[''] [&_input[type='radio']]:before:w-2 [&_input[type='radio']]:before:h-2 [&_input[type='radio']]:before:scale-0 [&_input[type='radio']]:before:bg-primary-50 [&_input[type='radio']]:before:rounded-full [&_input[type='radio']:checked]:before:scale-[1.125]">
                    <Field type="radio" name="indoor" value="true" />
                    <Typography>Indoor</Typography>
                </label>
            </div>
        </div>
    );
};

export default MapCreateSpotRain;
