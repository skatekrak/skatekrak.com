import axios from 'axios';
import { format } from 'date-fns';
import getConfig from 'next/config';
import React from 'react';

import createMarkup from 'lib/createMarkup';

import { Post } from 'components/pages/mag/Feed';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

type Props = {
    post: Post;
};

type State = {
    isLoading: boolean;
    relatedPosts?: any[];
};

class RelatedPosts extends React.PureComponent<Props, State> {
    public state: State = {
        isLoading: false,
    };

    public async componentDidMount() {
        this.setState({ isLoading: true });
        const { post } = this.props;

        try {
            const res = await axios.get(
                `${getConfig().publicRuntimeConfig.KRAKMAG_URL}/wp-json/wp/v2/posts?per_page=3&categories=${
                    post.categories[0]
                }&_embed`,
            );

            if (res.data) {
                this.setState({ relatedPosts: res.data });
            }
        } catch (err) {
            // console.log(err);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render() {
        const { isLoading, relatedPosts } = this.state;

        return (
            <>
                {relatedPosts && relatedPosts.length !== 0 && (
                    <div id="mag-related-posts">
                        <h3 id="mag-related-posts-title">Related posts</h3>
                        {isLoading && <SpinnerCircle />}
                        {relatedPosts && (
                            <ul id="mag-related-posts-list">
                                {relatedPosts.map((post) => (
                                    <li className="mag-related-posts-item">
                                        <div className="mag-related-posts-item-img-box-container">
                                            <div className="mag-related-posts-item-img-container">
                                                <div
                                                    className="mag-related-posts-item-img"
                                                    style={{
                                                        backgroundImage: `url("${post._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url}")`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mag-related-posts-item-details">
                                            <h4
                                                className="mag-related-posts-item-details-title"
                                                dangerouslySetInnerHTML={createMarkup(post.title.rendered)}
                                            />
                                            <p className="mag-related-posts-item-details-date">
                                                {format(post.date, 'MMMM D')}, {format(post.date, 'YYYY')}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </>
        );
    }
}

export default RelatedPosts;
