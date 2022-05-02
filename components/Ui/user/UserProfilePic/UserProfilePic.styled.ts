import styled from 'styled-components';

import { UserProfilePicSize } from './UserProfilePic';

type UserProfilePictureContainerProps = {
    size?: UserProfilePicSize;
};

export const UserProfilePictureContainer = styled.div<UserProfilePictureContainerProps>`
    position: relative;
    flex-shrink: 0;
    width: 1.5rem;
    margin: auto;
    padding-top: 100%;
    overflow: hidden;
    border-radius: 100%;

    ${({ size }) =>
        (size === 'small' && {
            width: '1rem',
        }) ||
        (size === 'medium' && {
            width: '2rem',
        }) ||
        (size === 'large' && {
            width: '3rem',
        })}
`;

type UserProfilePictureProps = {
    src: string;
};

export const UserProfilePicture = styled.div<UserProfilePictureProps>`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.color.tertiary.light};
    background-image: url(${({ src }) => src});
    background-position: center;
    background-size: cover;
`;
