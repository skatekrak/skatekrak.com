import React from 'react';

type Props = {
    className?: string;
};

const ArrowHeadIcon: React.FC<Props> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
        <path d="M64.37,46.59l-4.24-4.24h0L38.91,21.13a2,2,0,0,0-2.83,0l-3.54,3.54a2,2,0,0,0,0,2.83L51.64,46.59a2,2,0,0,1,0,2.83L32.55,68.51a2,2,0,0,0,0,2.83l3.54,3.54a2,2,0,0,0,2.83,0L60.13,53.66h0l4.24-4.24A2,2,0,0,0,64.37,46.59Z" />
    </svg>
);

export default React.memo(ArrowHeadIcon);
