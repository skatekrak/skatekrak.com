import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import VideoPlayerContainer from 'components/Ui/Player/VideoPlayerContainer';
import ScrollBar from 'components/Ui/Scrollbar';
import { Clip, getClips, Spot } from 'lib/carrelageClient';
import Bugsnag from '@bugsnag/js';
import { KrakLoading } from 'components/Ui/Icons/Spinners';

export type MapFullSpotMainClipsProps = {
    clips: Clip[];
    spot: Spot;
};

const MapFullSpotMainClips = ({ clips: defaultClips, spot }: MapFullSpotMainClipsProps) => {
    const [hasMore, setHasMore] = useState(defaultClips.length <= spot.clipsStat.all);
    const [clips, setClips] = useState(() => defaultClips);
    const [isLoading, setLoading] = useState(false);

    const loadMore = async (page: number) => {
        setLoading(true);
        console.log('load more', page);

        try {
            const lastClip = clips[clips.length - 1];
            const newClips = await getClips(spot.id, lastClip.createdAt);
            setClips((clips) => [...clips, ...newClips]);
            if (newClips.length <= 0) {
                setHasMore(false);
            }
        } catch (err) {
            Bugsnag.notify(err);
        } finally {
            setLoading(false);
            setHasMore(false);
        }
    };

    return (
        <ScrollBar id="clip-scroll" maxHeight="100%">
            <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                loadMore={loadMore}
                hasMore={!isLoading && hasMore}
                getScrollParent={() => document.getElementsByClassName('simplebar-content-wrapper')[0] as HTMLElement}
                useWindow={false}
            >
                <div id="map-full-spot-popup-main">
                    <div id="map-full-spot-popup-main-clips">
                        {clips.map((clip) => (
                            <div key={clip.id} className="map-full-spot-popup-main-clip">
                                <h2 className="map-full-spot-popup-main-clip-title">{clip.title}</h2>
                                <VideoPlayerContainer clip={clip} />
                            </div>
                        ))}
                        {isLoading && <KrakLoading />}
                    </div>
                </div>
            </InfiniteScroll>
        </ScrollBar>
    );
};

export default MapFullSpotMainClips;
