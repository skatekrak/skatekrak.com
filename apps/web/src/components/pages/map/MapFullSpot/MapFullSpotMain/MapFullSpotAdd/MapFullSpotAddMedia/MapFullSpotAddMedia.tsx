import React from 'react';
import * as Yup from 'yup';
import { FileWithPath } from 'react-dropzone';

import Typography from '@/components/Ui/typography/Typography';
import { Field, Form, Formik } from 'formik';
import MapFullSpotAddMediaInput from './MapFullSpotAddMediaInput';
import Feudartifice from '@/shared/feudartifice';
import { useQueryClient } from '@tanstack/react-query';
import { useFullSpotSelectedTab } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';
import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary';

type AddMediaFormValues = {
    file: FileWithPath | null;
    caption: string;
};

const addMediaFormSchema = Yup.object().shape({
    file: Yup.mixed().nullable().required(),
    caption: Yup.string(),
});

const MapFullSpotAddMedia = () => {
    const spotOverview = useMapStore((state) => state.spotOverview);
    const queryClient = useQueryClient();
    const [, selectFullSpotTab] = useFullSpotSelectedTab();

    const onSubmit = async (values: AddMediaFormValues) => {
        if (spotOverview == null) {
            alert('spot undefined');
            return;
        }

        if (values.file == null) {
            alert('file undefined');
            return;
        }

        try {
            let media = await Feudartifice.media.createMedia({
                caption: values.caption,
                spot: spotOverview.spot.id,
            });

            media = await Feudartifice.media.uploadMedia(media.id, values.file);
            selectFullSpotTab('media');

            queryClient.invalidateQueries({ queryKey: ['load-overview', spotOverview.spot.id] });
            queryClient.setQueryData(['fetch-spot-medias', spotOverview.spot.id, null], (prevData: any) => {
                if (prevData == null) return prevData;

                console.log('new media', media);

                return {
                    pages: [[media], ...prevData.pages],
                    pageParams: prevData.pageParams,
                };
            });
        } catch (err) {
            console.error(err);
        }
    };

    const initialValues: AddMediaFormValues = {
        file: null,
        caption: '',
    };

    return (
        <div className="relative flex flex-col h-full p-8 px-4 overflow-y-auto tablet:p-8">
            <Typography className="shrink-0 mb-2" component="heading6">
                Attach an image or a video to this spot
            </Typography>
            <Typography className="shrink-0 text-onDark-mediumEmphasis" component="body2">
                Image: jpeg, png, webP / Video: mp4
            </Typography>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={addMediaFormSchema}>
                {({ isSubmitting, isValid }) => (
                    <Form className="laptop-s:grid laptop-s:grid-cols-[2fr_1.25fr] laptop-s:gap-8 laptop-s:h-full laptop-s:mt-8 laptop-l:grid-cols-[2fr_minmax(18rem,1fr)]">
                        <MapFullSpotAddMediaInput />
                        <div className="flex flex-col">
                            <Typography component="subtitle1">Add a caption</Typography>
                            <Field name="caption">
                                {({ field }) => (
                                    <textarea
                                        className="w-full mt-4 mb-8 p-4 text-base text-onDark-highEmphasis bg-tertiary-light rounded resize-y placeholder:text-onDark-lowEmphasis"
                                        id="caption"
                                        name="caption"
                                        placeholder="Your caption here"
                                        rows={6}
                                        {...field}
                                    />
                                )}
                            </Field>
                            <ButtonPrimary
                                className="w-full mt-auto"
                                type="submit"
                                loading={isSubmitting}
                                disabled={isSubmitting || !isValid}
                            >
                                Add media
                            </ButtonPrimary>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MapFullSpotAddMedia;
