import React from 'react';
import styled, { css } from 'styled-components';

type Props = {
    selected: boolean;
    faded: boolean;
    src: string;
    srcSet: string;
    alt?: string;
    /** width and height unit */
    size?: string;
};

/** Used to display a rounded image for QuickAccess maps */
const RoundedImage = ({ selected, faded, src, srcSet, alt, size = '2.5rem' }: Props) => {
    return (
        <ImageContainer selected={selected}>
            <Image size={size} faded={faded} src={src} srcSet={srcSet} alt={alt} />
        </ImageContainer>
    );
};

export default RoundedImage;

/**
 * STYLED COMPONENTS
 */
type ImageContainerProps = {
    selected: boolean;
};

const ImageContainer = styled.div<ImageContainerProps>`
    position: relative;

    ${({ theme, selected }) =>
        selected &&
        css`
            &:after {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: -0.75rem;
                display: block;
                width: 0.125rem;
                background-color: ${theme.color.primary[80]};
            }
        `}
`;

type ImageProps = {
    faded: boolean;
    size: string;
};

const Image = styled.img<ImageProps>`
    display: block;
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    border: 1px solid ${({ theme }) => theme.color.tertiary.light};
    border-radius: 100%;

    ${({ faded }) =>
        faded && {
            opacity: 0.5,
        }}
`;
