import React from 'react';

import * as S from './UserProfilePic.styled';

export type UserProfilePicSize = 'small' | 'medium' | 'large';

type Props = {
    className?: string;
    src?: string;
    size?: UserProfilePicSize;
};

const UserProfilePic: React.FC<Props> = ({ className, src, size }) => {
    return (
        <S.UserProfilePictureContainer className={className} size={size}>
            <S.UserProfilePicture
                src={
                    src
                        ? src
                        : 'https://res.cloudinary.com/krak-dev/image/upload/v1651408716/assets/user-placeholder.png'
                }
            />
        </S.UserProfilePictureContainer>
    );
};

export default UserProfilePic;
