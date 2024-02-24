import React from 'react';

interface EmojiProps {
    label?: string;
    symbol: string;
}

const Emoji: React.FC<EmojiProps> = ({ label, symbol }) => (
    <span className="emoji" aria-hidden={label ? undefined : 'true'} aria-label={label ? label : undefined} role="img">
        {symbol}
    </span>
);

export default Emoji;
