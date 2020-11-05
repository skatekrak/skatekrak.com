import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Link from 'next/link';
import React from 'react';
import Truncate from 'react-truncate';

import createMarkup from 'lib/createMarkup';

import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import useLatestPosts from 'lib/hook/mag/latest-posts';

const LatestPosts = () => {
    const { isLoading, data: latestPosts } = useLatestPosts();

    return (
        <div className="mag-sidebar-posts">
            <h3 className="mag-sidebar-posts-title">Latest articles</h3>
            {isLoading && <SpinnerCircle />}
            {latestPosts != null && latestPosts.length !== 0 && (
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
                                                    backgroundImage: `url("${post.thumbnailImage}")`,
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
};

export default React.memo(LatestPosts);
