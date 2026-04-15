import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

type Props = {
    className?: string;
    src?: string;
};

const UserProfilePic: React.FC<Props> = ({ className, src }) => (
    <div className={classNames('relative w-8 h-8 rounded-full bg-tertiary-light overflow-hidden', className)}>
        <Image src={src ? src : '/images/user-placeholder.png'} alt="Account" fill />
    </div>
);

export default UserProfilePic;
