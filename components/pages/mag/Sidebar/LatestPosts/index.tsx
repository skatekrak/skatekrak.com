import axios from 'axios';
import { format, parseISO } from 'date-fns';
import getConfig from 'next/config';
import React from 'react';
import Truncate from 'react-truncate';

import createMarkup from 'lib/createMarkup';

import Link from 'components/Link';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

type Props = {};

type State = {
    isLoading: boolean;
    latestPosts?: any[];
};

class LatestPosts extends React.PureComponent<Props, State> {
    public state: State = {
        isLoading: false,
        latestPosts: [],
    };

    public async componentDidMount() {
        this.setState({ isLoading: true });

        try {
            const res = await axios.get(
                `${getConfig().publicRuntimeConfig.KRAKMAG_URL}/wp-json/wp/v2/posts?per_page=3&_embed`,
            );

            if (res.data) {
                this.setState({ latestPosts: res.data });
            }
        } catch (err) {
            // console.log(err);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render() {
        const { isLoading, latestPosts } = this.state;

        return (
            <div className="mag-sidebar-posts">
                <h3 className="mag-sidebar-posts-title">Latest articles</h3>
                {isLoading && <SpinnerCircle />}
                {latestPosts.length !== 0 && (
                    <ul className="mag-sidebar-posts-list">
                        {latestPosts.map((post) => (
                            <li key={post.id} className="mag-sidebar-posts-item">
                                <Link href={`/mag/${post.slug}`}>
                                    <a>
                                        <div className="mag-sidebar-posts-item-img-box-container">
                                            <div className="mag-sidebar-posts-item-img-container">
                                                <div
                                                    className="mag-sidebar-posts-item-img"
                                                    style={{
                                                        backgroundImage: `url("${post._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url}")`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mag-sidebar-posts-item-details">
                                            <h4 className="mag-sidebar-posts-item-details-title">
                                                <Truncate lines={2} ellipsis="..." trimWhitespace>
                                                    <span dangerouslySetInnerHTML={createMarkup(post.title.rendered)} />
                                                </Truncate>
                                            </h4>
                                            <p className="mag-sidebar-posts-item-details-date">
                                                {format(parseISO(post.date), 'MMMM d')},{' '}
                                                {format(parseISO(post.date), 'yyyy')}
                                            </p>
                                        </div>
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default LatestPosts;
