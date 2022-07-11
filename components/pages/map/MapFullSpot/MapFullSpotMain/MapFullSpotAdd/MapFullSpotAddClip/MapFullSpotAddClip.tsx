import Bugsnag from '@bugsnag/js';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import React, { FocusEventHandler, useState } from 'react';
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

    const { data, isError, isFetched } = useVideoInformation(url);

    const onBlur: FocusEventHandler<HTMLInputElement> = (event) => {
        setURL(event.target.value);
    };

    const onSubmit = async () => {
        setSubmitting(true);

        try {
            await Feudartifice.clips.addClip(spotOverview.spot.id, url);
            dispatch(selectFullSpotTab('clips'));
        } catch (err) {
            console.error(err);
            Bugsnag.leaveBreadcrumb('Error submitting clip', {
                spotId: spotOverview.spot.id,
                clipUrl: url,
            });
            Bugsnag.notify(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <S.MapFullSpotAddClipContainer>
            <S.MapFullSpotAddClipTitle component="heading6">
                Attach a Youtube video or Vimeo to this spot
            </S.MapFullSpotAddClipTitle>
            <S.MapFullSpotAddClipInput placeholder="Paste link here" onBlur={onBlur} />
            <S.MapFullSpotAddClipSubmit disabled={isError || !isFetched} loading={isSubmitting} onClick={onSubmit}>
                Add clip
            </S.MapFullSpotAddClipSubmit>
            <S.MapFullSpotAddClipPreviewTitle component="heading6">
                {data != null ? data.title : 'Static title'}
            </S.MapFullSpotAddClipPreviewTitle>
            <VideoPlayer url={data != null ? url : ''} />
        </S.MapFullSpotAddClipContainer>
    );
};

export default MapFullSpotAddClip;
