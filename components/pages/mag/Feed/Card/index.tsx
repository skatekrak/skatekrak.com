import { format } from 'date-fns';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

import createMarkup from 'lib/createMarkup';
import decodeHTML from 'lib/decodeHTML';

import Link from 'components/Link';
import { Post } from 'components/pages/mag/Feed';
import ClipboardButton from 'components/Ui/Button/ClipboardButton';

type Props = {
    post: Post;
};

type State = {};

class Card extends React.PureComponent<Props, State> {
    public render() {
        const { post } = this.props;
        return (
            <>
                <Link href={`/mag/${post.slug}`}>
                    <a className="mag-card-link">
                        <div className="mag-card-cover-img-container">
                            <div
                                className="mag-card-cover-img"
                                style={{ backgroundImage: `url("${post.thumbnailImage}")` }}
                            />
                        </div>
                    </a>
                </Link>
                <div className="mag-card-share">
                    <FacebookShareButton
                        url={`https://skatekrak.com/mag/${post.slug}`}
                        quote={`${decodeHTML(post.title.rendered)} - shared via skatekrak.com`}
                    >
                        <FacebookIcon size={24} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        url={`https://skatekrak.com/mag/${post.slug}`}
                        title={decodeHTML(post.title.rendered)}
                        via="skatekrak"
                    >
                        <TwitterIcon size={24} round />
                    </TwitterShareButton>
                    <ClipboardButton value={`https://skatekrak.com/mag/${post.slug}`} />
                </div>
                <div className="mag-card-details">
                    <p className="mag-card-details-category">{post.categoriesString}</p>
                    <Link href={`/mag?id=${post.id}`} as={`/mag/${post.slug}`}>
                        <a className="mag-card-details-link">
                            <h2
                                className="mag-card-details-title"
                                dangerouslySetInnerHTML={createMarkup(post.title.rendered)}
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
}

export default Card;
