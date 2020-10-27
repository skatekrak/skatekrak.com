import React from 'react';

interface EmojiProps {
    label?: string;
    symbol: string;
}

const Emoji: React.SFC<EmojiProps> = ({ label, symbol }) => (
    <span className="emoji" aria-hidden={label ? null : 'true'} aria-label={label ? label : null} role="img">
        {symbol}
    </span>
);

export default Emoji;
