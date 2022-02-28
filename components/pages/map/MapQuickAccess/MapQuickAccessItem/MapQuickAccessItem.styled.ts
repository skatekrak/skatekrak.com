import styled, { css } from 'styled-components';

import Typography from 'components/Ui/typography/Typography';

type MapQuickAccessItemImageProps = {
    noMapSelected: boolean;
};

export const MapQuickAccessItemImage = styled.img<MapQuickAccessItemImageProps>`
    position: static;
    display: block;
    width: 2.5rem;
    height: 2.5rem;
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    border: 1px solid ${({ theme }) => theme.color.tertiary.light};
    border-radius: 100%;

    ${({ noMapSelected }) =>
        noMapSelected && {
            opacity: 0.5,
        }}
`;

export const MapQuickAccessItemDescription = styled.div`
    display: none;
    position: absolute;
    top: 0rem;
    left: -19rem;
    width: 17.5rem;
    padding: 1rem;
    text-align: left;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
`;

export const MapQuickAccessItemHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    & svg {
        width: 1.5rem;
        fill: ${({ theme }) => theme.color.onDark.highEmphasis};
    }
`;

export const MapQuickAccessItemBody = styled(Typography)`
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

type MapQuickAccessItemProps = {
    isSelected: boolean;
};

export const MapQuickAccessItem = styled.a<MapQuickAccessItemProps>`
    position: static;
    display: flex;
    padding: 0.375rem 0.75rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};

    &:hover {
        ${MapQuickAccessItemDescription} {
            display: block;
        }
    }

    ${({ theme, isSelected }) =>
        isSelected &&
        css`
            &:after {
                content: '';
                position: absolute;
                top: 0.5rem;
                bottom: 0.5rem;
                left: -0.75rem;
                display: block;
                width: 0.25rem;
                background-color: ${theme.color.primary[80]};
            }
        `}
`;
