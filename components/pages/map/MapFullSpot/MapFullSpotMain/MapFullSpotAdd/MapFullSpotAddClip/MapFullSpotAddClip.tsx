import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import React, { FocusEventHandler, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Feudartifice from 'shared/feudartifice';
import { useVideoInformation } from 'shared/feudartifice/hooks/clips';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { selectFullSpotTab } from 'store/map/slice';

import * as S from './MapFullSpotAddClip.styled';

const MapFullSpotAddClip = () => {
    const spotOverview = useAppSelector((state) => state.map.spotOverview);
    const dispatch = useAppDispatch();
    const [url, setURL] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const { data, isError, isFetched } = useVideoInformation(url);

    const onBlur: FocusEventHandler<HTMLInputElement> = (event) => {
        setURL(event.target.value);
    };

    const onSubmit = async () => {
        setSubmitting(true);

        if (spotOverview == null) {
            alert('spot undefined');
            return;
        }

        try {
            const clip = await Feudartifice.clips.addClip(spotOverview.spot.id, url);
            dispatch(selectFullSpotTab('clips'));
            queryClient.invalidateQueries({ queryKey: ['load-overview', spotOverview.spot.id] });
            queryClient.setQueryData(['fetch-spot-clips', spotOverview.spot.id], (prevData: any) => {
                if (prevData == null) return prevData;

                return {
                    pages: [[clip], ...prevData.pages],
                    pagaParams: prevData.pageParams,
                };
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <S.MapFullSpotAddClipContainer>
            <S.MapFullSpotAddClipTitle component="heading6">
                Attach a Youtube video or Vimeo to this spot
            </S.MapFullSpotAddClipTitle>
            <S.MapFullSpotAddClipInputRow>
                <S.MapFullSpotAddClipInputContainer>
                    <S.MapFullSpotAddClipInput placeholder="Paste link here" onBlur={onBlur} />
                    {isError && (
                        <S.MapFullSpotAddClipError component="body2">
                            URL not valid, we only support youtube of vimeo video
                        </S.MapFullSpotAddClipError>
                    )}
                </S.MapFullSpotAddClipInputContainer>
                <S.MapFullSpotAddClipSubmit disabled={isError || !isFetched} loading={isSubmitting} onClick={onSubmit}>
                    Add clip
                </S.MapFullSpotAddClipSubmit>
            </S.MapFullSpotAddClipInputRow>
            {data != null && (
                <>
                    <S.MapFullSpotAddClipPreviewTitle component="heading6">
                        {data.title}
                    </S.MapFullSpotAddClipPreviewTitle>
                    <VideoPlayer url={url} />
                </>
            )}
        </S.MapFullSpotAddClipContainer>
    );
};

export default MapFullSpotAddClip;
