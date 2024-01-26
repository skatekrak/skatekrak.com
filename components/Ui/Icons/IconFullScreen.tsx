import React from 'react';

type Props = {
    className?: string;
};

const IconFullScreen: React.FC<Props> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3H22V9H20V5H16V3ZM2 3H8V5H4V9H2V3ZM20 19V15H22V21H16V19H20ZM4 19H8V21H2V15H4V19Z" />
    </svg>
);

export default React.memo(IconFullScreen);
