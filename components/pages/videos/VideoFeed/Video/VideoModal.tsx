import axios from 'axios';
import { distanceInWordsToNow } from 'date-fns';
import getConfig from 'next/config';
import Router from 'next/router';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

import ClipboardButton from 'components/Ui/Button/ClipboardButton';
import Emoji from 'components/Ui/Icons/Emoji';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import Modal from 'components/Ui/Modal';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import { Video } from 'rss-feed';

type Props = {
    id: string;
};

type State = {
    open: boolean;
    video?: Video;
    nothingFound: boolean;
};

class VideoModal extends React.Component<Props, State> {
    public state: State = {
        open: false,
        nothingFound: false,
    };

    public async componentDidMount() {
        // To avoid DOM rendering issue
        this.setState({ open: true });

        try {
            const res = await axios.get(`${getConfig().publicRuntimeConfig.RSS_BACKEND_URL}/videos/${this.props.id}`);

            if (res.data) {
                this.setState({ video: res.data });
            }
        } catch (err) {
            this.setState({ nothingFound: true });
        }

        // Override default modal styles
        document.getElementsByClassName('modal-overlay')[0].classList.add('video-modal-overlay');
        document.getElementsByClassName('modal-container')[0].classList.add('video-modal-container');
        document.getElementsByClassName('modal-close-button')[0].classList.add('video-modal-close-button');
    }

    public componentWillUnmount() {
        document.getElementsByClassName('modal-close-button')[0].classList.remove('video-modal-close-button');
    }

    public render() {
        const { video, open, nothingFound } = this.state;
        return (
            <Modal open={open} onClose={this.onClose} closeOnOverlayClick={false}>
                {video && (
                    <div className="video-modal">
                        <div className="video-card-share">
                            <FacebookShareButton
                                url={this.getVideoPopupUrl(video)}
                                quote={`${video.title} shared via skatekrak.com`}
                            >
                                <FacebookIcon size={24} round />
                            </FacebookShareButton>
                            <TwitterShareButton url={this.getVideoPopupUrl(video)} title={video.title} via="skatekrak">
                                <TwitterIcon size={24} round />
                            </TwitterShareButton>
                            <ClipboardButton value={this.getVideoPopupUrl(video)} />
                        </div>
                        <VideoPlayer url={`https://www.youtube.com/watch?v=${video.videoId}`} playing controls />
                        <h2 className="video-modal-title">{video.title}</h2>
                        <div className="video-modal-details">
                            <p className="video-modal-details-source">
                                by {video.source.title}
                                <span className="video-modal-details-date">
                                    &nbsp;- {distanceInWordsToNow(video.createdAt)}
                                </span>
                            </p>
                        </div>
                    </div>
                )}
                {!video && !nothingFound && <KrakLoading />}
                {nothingFound && (
                    <div className="video-modal-nothing">
                        <img
                            className="video-modal-nothing-img"
                            src="/static/images/pindejo-lucas-beaufort.jpg"
                            alt="Lucas beaufort krak illustration"
                        />
                        <p>
                            Something went wrong when trying to copy the url... but still, you're on the right page to
                            enjoy some skateboarding videos.
                        </p>
                        <p>
                            <Emoji symbol="🍕" label="pizza" /> lucky you <Emoji symbol="🌭" label="hot dog" />
                        </p>
                    </div>
                )}
            </Modal>
        );
    }

    private getVideoPopupUrl(video: Video): string {
        return `${window.location.origin}/video?id=${video.id}`;
    }

    private onClose = () => {
        this.setState({ open: false });
        Router.replace('/video');
    };
}

export default VideoModal;
