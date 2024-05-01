import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import { useRouter } from 'next/router';
import React from 'react';

import VideoCardShare from '@/components/pages/videos/VideoFeed/Video/VideoCardShare';
import Emoji from '@/components/Ui/Icons/Emoji';
import Modal from '@/components/Ui/Modal';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import { SourceType } from '@/lib/constants';
import { IContent } from 'rss-feed';

type Props = {
    video?: IContent;
    open: boolean;
};

const VideoModal = ({ video, open }: Props) => {
    const router = useRouter();

    const onClose = () => {
        router.replace('/video');
    };

    const customClassNames = {
        customOverlay: 'video-modal-overlay',
        customModal: 'video-modal-container',
        customCloseButton: 'video-modal-close-button',
    };

    return (
        <Modal open={open} onClose={onClose} customClassNames={customClassNames} closeOnOverlayClick={false}>
            {video ? (
                <div className="video-modal">
                    <VideoCardShare video={video} />
                    {video.source.sourceType === SourceType.YOUTUBE && (
                        <VideoPlayer url={`https://www.youtube.com/watch?v=${video.contentId}`} playing controls pip />
                    )}
                    {video.source.sourceType === SourceType.VIMEO && (
                        <VideoPlayer
                            url={`https://vimeo.com/${video.contentId.replace('/videos/', '')}`}
                            playing
                            controls
                            pip
                        />
                    )}
                    <h2 className="video-modal-title">{video.title}</h2>
                    <div className="video-modal-details">
                        <p className="video-modal-details-source">
                            by {video.source.title}
                            <span className="video-modal-details-date">
                                &nbsp;- {formatDistanceToNow(parseISO(video.createdAt))}
                            </span>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="video-modal-nothing">
                    <img
                        className="video-modal-nothing-img"
                        src="/images/pindejo-lucas-beaufort.jpg"
                        alt="Lucas beaufort krak illustration"
                    />
                    <p>
                        Something went wrong when trying to copy the url... but still, you're on the right page to enjoy
                        some skateboarding videos.
                    </p>
                    <p>
                        <Emoji symbol="🍕" label="pizza" /> lucky you <Emoji symbol="🌭" label="hot dog" />
                    </p>
                </div>
            )}
        </Modal>
    );
};

export default VideoModal;
