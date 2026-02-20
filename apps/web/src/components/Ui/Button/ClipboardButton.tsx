import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

import IconClipboard from '@/components/Ui/Icons/Clipboard';

type Props = {
    value: string;
};

const ClipboardButton: React.FC<Props> = ({ value }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(value).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
        });
    }, [value]);

    return (
        <button
            className={classNames('clipboard-button', {
                'clipboard-button--copied': isCopied,
            })}
            onClick={copyToClipboard}
        >
            <IconClipboard />
            {isCopied ? 'Copied!' : ''}
        </button>
    );
};

export default ClipboardButton;
