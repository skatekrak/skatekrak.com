import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Card from 'components/pages/news/Articles/Article/Card';
import Emoji from 'components/Ui/Icons/Emoji';
import Modal from 'components/Ui/Modal';
import { Content } from 'rss-feed';

type Props = {
    content?: Content | undefined;
};

const ArticleModal = ({ content }: Props) => {
    const [open, setOpen] = useState(true);
    const router = useRouter();

    useEffect(() => {
        document.getElementsByClassName('modal-close-button')[0].classList.add('news-article-modal-close-button');

        return function cleanup() {
            document
                .getElementsByClassName('modal-close-button')[0]
                .classList.remove('news-article-modal-close-button');
        };
    });

    const onClose = () => {
        setOpen(false);
        router.replace('/news');
    };

    return (
        <Modal open={open} onClose={onClose} closable={true}>
            {content ? (
                <div className="news-article-modal">
                    <Card content={content} />
                    <a
                        href={content.webUrl}
                        className="news-article-modal-read-more button-primary"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Read full article
                    </a>
                </div>
            ) : (
                <div className="news-article-modal-nothing">
                    <img
                        className="news-article-modal-nothing-img"
                        src="/images/pindejo-lucas-beaufort.jpg"
                        alt="Lucas beaufort krak illustration"
                    />
                    <p>
                        Something went wrong when trying to copy the url... but still, you're on the right page to enjoy
                        some skateboarding news.
                    </p>
                    <p>
                        <Emoji symbol="🍕" label="pizza" /> lucky you <Emoji symbol="🌭" label="hot dog" />
                    </p>
                </div>
            )}
        </Modal>
    );
};

export default ArticleModal;
