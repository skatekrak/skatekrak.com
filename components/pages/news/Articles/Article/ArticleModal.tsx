import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Card from 'components/pages/news/Articles/Article/Card';
import Emoji from 'components/Ui/Icons/Emoji';
import Modal from 'components/Ui/Modal';

import Content from 'models/Content';

type Props = {
    content?: Content | undefined;
    show: boolean;
};

const ArticleModal = ({ content, show }: Props) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Use the useEffect hook to show the popup and avoid SSR issue
    useEffect(() => {
        setOpen(show);

        const elements = document.getElementsByClassName('modal-close-button');
        if (elements.length > 0) {
            const first = elements[0];
            first.classList.add('news-article-modal-close-button');
        }

        return function cleanup() {
            if (elements.length > 0) {
                const first = elements[0];
                first.classList.remove('news-article-modal-close-button');
            }
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
