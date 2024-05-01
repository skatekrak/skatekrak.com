import React from 'react';

type Props = {
    icon: React.ReactNode;
};

const IconFull: React.FC<Props> = ({ icon }) => <span className="icon-full">{icon}</span>;

export default IconFull;
