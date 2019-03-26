import axios from 'axios';
import Router from 'next/router';
import React from 'react';

import Card from 'components/pages/news/Articles/Article/Card';
import Emoji from 'components/Ui/Icons/Emoji';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import Modal from 'components/Ui/Modal';
import { Content } from 'rss-feed';

type Props = {
    id: string;
};

type State = {
    open: boolean;
    content?: Content;
    nothingFound: boolean;
};

class ArticleModal extends React.Component<Props, State> {
    public state: State = {
        open: false,
        nothingFound: false,
    };

    public async componentDidMount() {
        // To avoid DOM rendering issue
        this.setState({ open: true });

        try {
            const res = await axios.get(`${process.env.RSS_BACKEND_URL}/contents/${this.props.id}`);

            if (res.data) {
                this.setState({ content: res.data });
            }
        } catch (err) {
            this.setState({ nothingFound: true });
        }
    }

    public render() {
        const { content, open, nothingFound } = this.state;
        return (
            <Modal open={open} onClose={this.onClose} closable={true}>
                {content && (
                    <div className="news-article-modal">
                        <Card content={content} />
                    </div>
                )}
                {!content && !nothingFound && <KrakLoading />}
                {nothingFound && (
                    <div className="news-article-modal-nothing">
                        <img
                            className="news-article-modal-nothing-img"
                            src="/static/images/pindejo-lucas-beaufort.jpg"
                            alt="Lucas beaufort krak illustration"
                        />
                        <p>
                            Something went wrong when trying to copy the url... but still, you're on the right page to
                            enjoy some skateboarding news.
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
        Router.replace('/news');
    };
}

export default ArticleModal;
