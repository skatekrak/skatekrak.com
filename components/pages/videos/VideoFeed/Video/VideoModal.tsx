import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import { useRouter } from 'next/router';
import React from 'react';

import VideoCardShare from 'components/pages/videos/VideoFeed/Video/VideoCardShare';
import Emoji from 'components/Ui/Icons/Emoji';
import Modal from 'components/Ui/Modal';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import { SourceType } from 'lib/constants';
import { Video } from 'rss-feed';

type Props = {
    video?: Video;
    open: boolean;
};

const VideoModal = ({ video, open }: Props) => {
    const router = useRouter();

    const onClose = () => {
        router.replace('/video');
    };

    return (
        <Modal
            open={open}
            classNames={{
                overlay: 'modal-overlay video-modal-overlay',
                modal: 'modal-container video-modal-container',
                closeButton: 'modal-close-button video-modal-close-button',
            }}
            onClose={onClose}
            closeOnOverlayClick={false}
        >
            {video ? (
                <div className="video-modal">
                    <VideoCardShare video={video} />
                    {video.source.type === SourceType.YOUTUBE && (
                        <VideoPlayer url={`https://www.youtube.com/watch?v=${video.videoId}`} playing controls pip />
                    )}
                    {video.source.type === SourceType.VIMEO && (
                        <VideoPlayer url={`https://vimeo.com/${video.videoId}`} playing controls pip />
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
