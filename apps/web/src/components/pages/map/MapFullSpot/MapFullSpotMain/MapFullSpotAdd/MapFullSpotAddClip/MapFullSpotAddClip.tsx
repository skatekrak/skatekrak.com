import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import React, { FocusEventHandler, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Feudartifice from '@/shared/feudartifice';
import { useVideoInformation } from '@/shared/feudartifice/hooks/clips';
import { useMapStore } from '@/store/map';

import Typography from '@/components/Ui/typography/Typography';
import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary';
import { useFullSpotSelectedTab } from '@/lib/hook/queryState';

const MapFullSpotAddClip = () => {
    const spotOverview = useMapStore((state) => state.spotOverview);
    const [url, setURL] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const [, selectFullSpotTab] = useFullSpotSelectedTab();

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
            queryClient.invalidateQueries({ queryKey: ['load-overview', spotOverview.spot.id] });
            queryClient.setQueryData(['fetch-spot-clips', spotOverview.spot.id], (prevData: any) => {
                if (prevData == null) return prevData;

                return {
                    pages: [[clip], ...prevData.pages],
                    pageParams: prevData.pageParams,
                };
            });

            selectFullSpotTab('clips');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-full p-8 px-4 overflow-y-auto tablet:p-8">
            <Typography className="shrink-0" component="heading6">
                Attach a Youtube video or Vimeo to this spot
            </Typography>
            <div className="flex flex-col items-start my-6 tablet:flex-row tablet:items-center">
                <div className="relative mb-4 tablet:grow tablet:mr-4 tablet:mb-0 laptop-s:grow-0 laptop-s:w-1/2 laptop-s:min-w-[25rem] laptop-s:mr-4 laptop-s:mb-0">
                    <input
                        className="w-full p-4 text-base text-onDark-highEmphasis bg-tertiary-light rounded placeholder:text-onDark-lowEmphasis"
                        placeholder="Paste link here"
                        onBlur={onBlur}
                    />
                    {isError && (
                        <Typography
                            className="mt-2 text-system-error tablet:absolute tablet:top-[calc(100%+0.5rem)] tablet:mt-0"
                            component="body2"
                        >
                            URL not valid, we only support youtube of vimeo video
                        </Typography>
                    )}
                </div>
                <ButtonPrimary
                    className="tablet:w-max"
                    disabled={isError || !isFetched}
                    loading={isSubmitting}
                    onClick={onSubmit}
                >
                    Add clip
                </ButtonPrimary>
            </div>
            {data != null && (
                <>
                    <Typography className="mt-8 mb-4 tablet:mt-12" component="heading6">
                        {data.title}
                    </Typography>
                    <VideoPlayer url={url} />
                </>
            )}
        </div>
    );
};

export default MapFullSpotAddClip;
