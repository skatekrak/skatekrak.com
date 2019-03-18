import axios from 'axios';
import Router from 'next/router';
import React from 'react';

import { KrakLoading } from 'components/Ui/Icons/Spinners';
import Modal from 'components/Ui/Modal';
import { Content } from 'rss-feed';

type Props = {
    id: string;
};

type State = {
    open: boolean;
    content?: Content;
};

class ArticleModal extends React.Component<Props, State> {
    public state: State = {
        open: false,
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
            this.onClose();
        }
    }

    public render() {
        const { content, open } = this.state;
        return (
            <Modal open={open} onClose={this.onClose} closable={true}>
                {content && (
                    <p>
                        {content.author}
                        <br /> {content.createdAt}
                        <br /> {content.title}
                        <br /> {content.summary}
                        <br /> {content.webUrl}
                        <br />
                        {content.keywords}
                    </p>
                )}
                {!content && <KrakLoading />}
            </Modal>
        );
    }

    private onClose = () => {
        this.setState({ open: false });
        Router.replace('/news');
    };
}

export default ArticleModal;
