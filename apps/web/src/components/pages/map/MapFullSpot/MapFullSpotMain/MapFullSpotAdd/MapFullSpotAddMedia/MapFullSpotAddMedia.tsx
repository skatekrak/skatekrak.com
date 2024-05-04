import React from 'react';
import * as Yup from 'yup';
import { FileWithPath } from 'react-dropzone';

import Typography from '@/components/Ui/typography/Typography';
import * as S from './MapFullSpotAddMedia.styled';
import { Field, Formik } from 'formik';
import MapFullSpotAddMediaInput from './MapFullSpotAddMediaInput';
import Feudartifice from '@/shared/feudartifice';
import { useQueryClient } from '@tanstack/react-query';
import { useFullSpotSelectedTab } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

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
