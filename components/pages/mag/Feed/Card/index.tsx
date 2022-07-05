import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

import createMarkup from 'lib/createMarkup';
import decodeHTML from 'lib/decodeHTML';

import ClipboardButton from 'components/Ui/Button/ClipboardButton';
import { SlicePost } from 'store/mag/slice';

type Props = {
    post: SlicePost;
};

const Card = ({ post }: Props) => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;

    return (
        <>
            <Link href={`/mag/${post.slug}`}>
                <a className="mag-card-link">
                    <div className="mag-card-cover-img-container">
                        <div
                            className="mag-card-cover-img"
                            style={{
                                backgroundImage: `url("${post.featuredImages[0].source_url.replace(
                                    'upload/mag',
                                    '/upload/w_800/mag',
                                )}")`,
                            }}
                        />
                    </div>
                </a>
            </Link>
            <div className="mag-card-share">
                <FacebookShareButton
                    url={`${baseURL}/mag/${post.slug}`}
                    quote={`${decodeHTML(post.title)} - shared via skatekrak.com`}
                >
                    <FacebookIcon size={24} round />
                </FacebookShareButton>
                <TwitterShareButton url={`${baseURL}/mag/${post.slug}`} title={decodeHTML(post.title)} via="skatekrak">
                    <TwitterIcon size={24} round />
                </TwitterShareButton>
                <ClipboardButton value={`${baseURL}/mag/${post.slug}`} />
            </div>
            <div className="mag-card-details">
                <p className="mag-card-details-category">{post.categories.join(', ')}</p>
                <Link href={`/mag?slug=${post.slug}`} as={`/mag/${post.slug}`}>
                    <a className="mag-card-details-link">
                        <h2 className="mag-card-details-title" dangerouslySetInnerHTML={createMarkup(post.title)} />
                    </a>
                </Link>
            </div>
        </>
    );
};

export default Card;
