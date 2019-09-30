import { format } from 'date-fns';
import React from 'react';

import Link from 'components/Link';
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
                <Link href={`/mag?id=${post.id}`} as={`/mag/${post.slug}`}>
                    <a className="mag-card-link">
                        <div className="mag-card-cover-img-container">
                            <div
                                className="mag-card-cover-img"
                                style={{ backgroundImage: `url("${post.thumbnailImage}")` }}
                            />
                        </div>
                    </a>
                </Link>
                <div className="mag-card-details">
                    <p className="mag-card-details-category">{post.categoriesString}</p>
                    <Link href={`/mag?id=${post.id}`} as={`/mag/${post.slug}`}>
                        <a className="mag-card-details-link">
                            <h2
                                className="mag-card-details-title"
                                dangerouslySetInnerHTML={this.createMarkup(post.title.rendered)}
                            />
                        </a>
                    </Link>
                    <span className="mag-card-details-date">
                        {format(post.date, 'MMMM D')}, {format(post.date, 'YYYY')}
                    </span>
                </div>
            </>
        );
    }

    private createMarkup(content) {
        return { __html: content };
    }
}

export default Card;
