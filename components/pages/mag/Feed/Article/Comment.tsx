/*
 * Npm import
 */
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
                We created a network for all our members to discuss skateboarding as a whole.
                <br />
                Let’s talk about it there, we are good folks ;)
            </p>
            <a
                className="button-primary mag-club-cta"
                href="https://www.krakito.com"
                target="_blank"
                rel="noreferrer noopener"
            >
                Join us
            </a>
            <div id="mag-article-comment-kraken-bg" />
        </div>
    </div>
);

/*
 * Export Default
 */
export default Comment;
