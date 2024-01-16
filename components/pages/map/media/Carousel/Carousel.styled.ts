import Typography from 'components/Ui/typography/Typography';
import styled from 'styled-components';
import media from 'styles/media';

export const Nav = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    transition: 150ms;

    ${media.tablet} {
        position: absolute;
        top: 1.5rem;
        left: 1.5rem;
        flex-direction: column;
        align-items: inherit;
        justify-content: inherit;
        padding: 0;
        opacity: 0;
    }
`;

export const NavAdditionalActionsContainer = styled.div`
    ${media.tablet} {
        margin-bottom: 1rem;
    }
`;

export const Carousel = styled.div`
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #141414;
    overflow: hidden;

    & .video-player-container {
        height: 100%;
    }

    &:hover {
        ${Nav} {
            opacity: 1;
        }
    }
`;

export const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

export const MenuContainer = styled.div``;

export const Menu = styled.nav`
    display: inline-flex;
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    overflow: hidden;
`;

export const MenuDivider = styled.div`
    margin: 0.5rem 0;
    width: 1px;
    background-color: ${({ theme }) => theme.color.onDark.divider};
`;

type IconButtonProps = {
    direction?: 'left';
    isActive?: boolean;
};

export const IconButton = styled.button<IconButtonProps>`
    display: flex;
    padding: 0.5rem 0.75rem;
    cursor: ${({ disabled }) => disabled && 'default'};

    & svg {
        width: 1.5rem;
        fill: ${({ isActive, disabled, theme }) =>
            isActive
                ? theme.color.onDark.highEmphasis
                : disabled
                ? theme.color.onDark.lowEmphasis
                : theme.color.onDark.mediumEmphasis};
        transform: ${({ direction }) => direction && 'rotate(180deg)'};
    }

    &:hover {
        & svg {
            fill: ${({ disabled, theme }) => !disabled && theme.color.onDark.highEmphasis};
        }
    }
`;

export const MediaDescription = styled.div`
    position: absolute;
    bottom: 4.125rem;
    left: 0;
    max-height: 80vh;
    width: 100%;
    padding: 1.25rem 1.5rem;
    margin-top: 0.5rem;
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    overflow-y: auto;

    ${media.tablet} {
        position: relative;
        max-width: 24rem;
        min-width: 16rem;
        max-height: 50vh;
        bottom: inherit;
    }
`;

export const MediaDescriptionDivider = styled.div`
    height: 1px;
    margin: 1rem 0 1.25rem;
    background-color: ${({ theme }) => theme.color.onDark.divider};
`;

export const MediaDescriptionUploadedBy = styled(Typography)`
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.color.onDark.lowEmphasis};
`;

export const MediaDescriptionSpot = styled.button`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    text-decoration: underline;
    font-size: 0.875rem;

    & svg {
        width: 1.25rem;
        margin-right: 0.25rem;
    }
`;

export const MediaDescriptionCaption = styled(Typography)`
    line-height: 1.8;
    margin-top: 0.75rem;
`;
