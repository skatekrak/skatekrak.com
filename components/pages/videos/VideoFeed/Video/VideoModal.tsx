import axios from 'axios';
import getConfig from 'next/config';
import Router from 'next/router';
import React from 'react';

import Emoji from 'components/Ui/Icons/Emoji';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import Modal from 'components/Ui/Modal';
import { Video } from 'rss-feed';
import VideoCard from './VideoCard';

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

        // Stylize close button
        document.getElementsByClassName('modal-close-button')[0].classList.add('news-article-modal-close-button');
    }

    public componentWillUnmount() {
        document.getElementsByClassName('modal-close-button')[0].classList.remove('news-article-modal-close-button');
    }

    public render() {
        const { video, open, nothingFound } = this.state;
        return (
            <Modal open={open} onClose={this.onClose} closable={true}>
                {video && (
                    <div className="news-article-modal">
                        <VideoCard video={video} />
                    </div>
                )}
                {!video && !nothingFound && <KrakLoading />}
                {nothingFound && (
                    <div className="news-article-modal-nothing">
                        <img
                            className="news-article-modal-nothing-img"
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

    private onClose = () => {
        this.setState({ open: false });
        Router.replace('/video');
    };
}

export default VideoModal;
