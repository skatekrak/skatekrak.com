import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import getConfig from 'next/config';
import Router, { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import VideoCardShare from 'components/pages/videos/VideoFeed/Video/VideoCardShare';
import Emoji from 'components/Ui/Icons/Emoji';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import Modal from 'components/Ui/Modal';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import { Video } from 'rss-feed';

type Props = {
    video?: Video;
};

type State = {
    open: boolean;
};

const VideoModal = ({ video }: Props) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const onClose = () => {
        setOpen(false);
        router.replace('/video');
    };

    useEffect(() => {
        setOpen(true);

        const overlays = document.getElementsByClassName('modal-overlay');
        if (overlays.length > 0) {
            overlays[0].classList.add('video-modal-overlay');
        }

        const containers = document.getElementsByClassName('modal-container');
        if (containers.length) {
            containers[0].classList.add('video-modal-container');
        }

        const closeButtons = document.getElementsByClassName('modal-close-button');
        if (closeButtons.length > 0) {
            closeButtons[0].classList.add('video-modal-close-button');
        }

        return function cleanup() {
            document.getElementsByClassName('modal-close-button')[0].classList.remove('video-modal-close-button');
        };
    });

    return (
        <Modal open={open} onClose={onClose} closeOnOverlayClick={false}>
            {video ? (
                <div className="video-modal">
                    <VideoCardShare video={video} />
                    <VideoPlayer url={`https://www.youtube.com/watch?v=${video.videoId}`} playing controls pip />
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
