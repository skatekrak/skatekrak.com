import React from 'react';

type Props = {
    icon: React.ReactNode;
};

const IconFull: React.SFC<Props> = ({ icon }) => <span className="icon-full">{icon}</span>;

export default IconFull;
