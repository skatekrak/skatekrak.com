import React from 'react';
import * as Yup from 'yup';
import { FileWithPath } from 'react-dropzone';

import Typography from 'components/Ui/typography/Typography';
import * as S from './MapFullSpotAddMedia.styled';
import { Field, Formik } from 'formik';
import MapFullSpotAddMediaInput from './MapFullSpotAddMediaInput';
import Feudartifice from 'shared/feudartifice';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { selectFullSpotTab } from 'store/map/slice';
import { useQueryClient } from '@tanstack/react-query';

type AddMediaFormValues = {
    file: FileWithPath | null;
    caption: string;
};

const addMediaFormSchema = Yup.object().shape({
    file: Yup.mixed().nullable().required(),
    caption: Yup.string(),
});

const MapFullSpotAddMedia = () => {
    const spotOverview = useAppSelector((state) => state.map.spotOverview);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

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
            const media = await Feudartifice.media.createMedia({
                caption: values.caption,
                spot: spotOverview.spot.id,
            });

            await Feudartifice.media.uploadMedia(media.id, values.file);
            dispatch(selectFullSpotTab('media'));
            queryClient.invalidateQueries({ queryKey: ['load-overview', spotOverview.spot.id] });
        } catch (err) {
            console.error(err);
        }
    };

    const initialValues: AddMediaFormValues = {
        file: null,
        caption: '',
    };

    return (
        <S.MapFullSpotAddMediaTabContainer>
            <S.MapFullSpotAddMediaTitle component="heading6">
                Attach an image or a video to this spot
            </S.MapFullSpotAddMediaTitle>
            <S.MapFullSpotAddMediaSubtitle component="body2">
                Image: jpeg, png, webP / Video: mp4
            </S.MapFullSpotAddMediaSubtitle>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={addMediaFormSchema}>
                {({ isSubmitting, isValid }) => (
                    <S.MapFullSpotAddMediaGrid>
                        <MapFullSpotAddMediaInput />
                        <S.MapFullSpotAddMediaSecondaryColumn>
                            <Typography component="subtitle1">Add a caption</Typography>
                            <Field name="caption">
                                {({ field }) => (
                                    <S.MapFullSpotAddMediaCaption
                                        id="caption"
                                        name="caption"
                                        placeholder="Your caption here"
                                        rows={6}
                                        {...field}
                                    />
                                )}
                            </Field>
                            <S.MapFullSpotAddMediaSubmitButton
                                type="submit"
                                loading={isSubmitting}
                                disabled={isSubmitting || !isValid}
                            >
                                Add media
                            </S.MapFullSpotAddMediaSubmitButton>
                        </S.MapFullSpotAddMediaSecondaryColumn>
                    </S.MapFullSpotAddMediaGrid>
                )}
            </Formik>
        </S.MapFullSpotAddMediaTabContainer>
    );
};

export default MapFullSpotAddMedia;
