import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';

export const MapQuickAccessMobileCustomItemContainer = styled.a`
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
`;

export const MapQuickAccessMobileCustomItemImage = styled.img`
    display: block;
    width: 3rem;
    height: 3rem;
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    border: 1px solid ${({ theme }) => theme.color.tertiary.light};
    border-radius: 100%;
`;

export const MapQuickAccessMobileCustomItemDesc = styled.div`
    margin-left: 1rem;
    overflow: hidden;
`;

export const MapQuickAccessMobileCustomItemSpots = styled(Typography)`
    margin-top: 0.25rem;
    color: ${({ theme }) => theme.color.onDark.lowEmphasis};
`;

export const MapQuickAccessMobileCustomItemDivider = styled.div`
    height: 1px;
    margin: 0 1.5rem;
    background-color: ${({ theme }) => theme.color.onDark.divider};

    &:last-of-type {
        display: none;
    }
`;
