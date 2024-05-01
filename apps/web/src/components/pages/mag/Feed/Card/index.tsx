import Link from 'next/link';
import React from 'react';

import createMarkup from '@/lib/createMarkup';
import decodeHTML from '@/lib/decodeHTML';

import SocialShare from '@/components/Ui/share/SocialShare';
import { SlicePost } from '@/store/mag/slice';

type Props = {
    post: SlicePost;
};

const Card = ({ post }: Props) => {
    const baseURL = process.env.NEXT_PUBLIC_WEBSITE_URL;

    return (
        <>
            <Link href={`/mag/${post.slug}`} className="mag-card-link">
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
            </Link>
            <div className="mag-card-share">
                <SocialShare
                    url={`${baseURL}/mag/${post.slug}`}
                    facebookQuote={`${decodeHTML(post.title)} - shared via skatekrak.com`}
                    twitterTitle={decodeHTML(post.title)}
                />
            </div>
            <div className="mag-card-details">
                <p className="mag-card-details-category">{post.categories.join(', ')}</p>
                <Link href={`/mag?slug=${post.slug}`} as={`/mag/${post.slug}`} className="mag-card-details-link">
                    <h2 className="mag-card-details-title" dangerouslySetInnerHTML={createMarkup(post.title)} />
                </Link>
            </div>
        </>
    );
};

export default Card;
