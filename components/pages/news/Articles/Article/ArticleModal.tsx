import { useRouter } from 'next/router';
import React from 'react';

import Card from 'components/pages/news/Articles/Article/Card';
import Emoji from 'components/Ui/Icons/Emoji';
import Modal from 'components/Ui/Modal';

import Content from 'models/Content';

type Props = {
    content?: Content | undefined;
    show: boolean;
};

const ArticleModal = ({ content, show }: Props) => {
    const router = useRouter();

    const onClose = () => {
        router.replace('/news');
    };

    const customClassNames = {
        customModal: 'news-article-modal-container',
    };

    return (
        <Modal open={show} onClose={onClose} customClassNames={customClassNames} closable={true}>
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
