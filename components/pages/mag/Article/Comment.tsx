/*
 * Npm import
 */
import Link from 'next/link';
import React from 'react';

/*
 * Local import
 */

/*
 * Code
 */
const Comment = () => (
    <div id="mag-article-comment-container">
        <div id="mag-article-comment">
            <p id="mag-article-comment-title">Leave a comment</p>
            <div id="mag-article-comment-textarea" />
            <div id="mag-article-comment-button">Post comment</div>
            <div id="mag-article-comment-bg" />
        </div>
        <div id="mag-article-comment-kraken">
            <p id="mag-article-comment-kraken-title">For krakens only</p>
            <p id="mag-article-comment-kraken-text">
                Go beyond the story with fellow passionate skateboarders from all around the world. No ads, no clickbait
                - only comments with substance.
            </p>
            <Link href="/">
                <a className="button-primary mag-club-cta">Join us</a>
            </Link>
            <div id="mag-article-comment-kraken-bg" />
        </div>
    </div>
);

/*
 * Export Default
 */
export default Comment;
