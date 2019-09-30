import axios from 'axios';
import { format } from 'date-fns';
import React from 'react';

import { Post } from 'components/pages/mag/Feed';
import { KrakLoading } from 'components/Ui/Icons/Spinners';

type Props = {
    id: string;
};

type State = {
    post?: Post;
    isLoading: boolean;
};

class Article extends React.PureComponent<Props, State> {
    public state: State = {
        isLoading: false,
    };

    public async componentDidMount() {
        this.setState({ isLoading: true });

        try {
            const res = await axios.get(`https://mag.skatekrak.com/wp-json/wp/v2/posts/${this.props.id}`);

            if (res.data) {
                this.setState({ post: res.data });
            }
        } catch (err) {
            // this.setState({ nothingFound: true });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render() {
        const { post, isLoading } = this.state;
        return (
            <div id="mag-article">
                {isLoading && <KrakLoading />}
                {post && post.date}
            </div>
        );
    }

    private createMarkup(content) {
        return { __html: content };
    }
}

export default Article;
