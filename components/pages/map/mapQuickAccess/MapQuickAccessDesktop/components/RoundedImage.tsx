import React from 'react';
import styled, { css } from 'styled-components';
import NextImage from 'next/image';

import useRemPX from 'lib/useRemPX';

type Props = {
    selected: boolean;
    src: string;
    alt?: string;
    /** width and height unit */
    size?: string;
};

/** Used to display a rounded image for QuickAccess maps */
const RoundedImage = ({ selected, src, alt, size = '2.5rem' }: Props) => {
    const px = useRemPX(size);
    return (
        <ImageContainer selected={selected}>
            <Image width={px} height={px} src={src} alt={alt} />
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

const Image = styled(NextImage)`
    display: block;
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    border: 1px solid ${({ theme }) => theme.color.tertiary.light};
    border-radius: 100%;
`;
