import { format } from 'date-fns';
import React from 'react';
import Truncate from 'react-truncate';

import { Post } from 'components/pages/mag/Feed';

type Props = {
    post: Post;
};

type State = {};

class Card extends React.PureComponent<Props, State> {
    public render() {
        const { post } = this.props;
        return (
            <>
                <a href="#" className="mag-card-link">
                    <div className="mag-card-cover-img-container">
                        <div
                            className="mag-card-cover-img"
                            style={{ backgroundImage: `url("${post.thumbnailImage}")` }}
                        />
                    </div>
                </a>
                <div className="mag-card-details">
                    <p className="mag-card-details-category">{post.categoriesString}</p>
                    <a href="#" className="mag-card-details-link">
                        <h2 className="mag-card-details-title">
                            <Truncate lines={2} ellipsis="...">
                                {post.title.rendered}
                            </Truncate>
                        </h2>
                    </a>
                    <span className="mag-card-details-date">
                        {format(post.date, 'MMMM D')}, {format(post.date, 'YYYY')}
                    </span>
                </div>
            </>
        );
    }
}

export default Card;
