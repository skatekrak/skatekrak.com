import styled, { css } from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import { MapQuickAccessDesktopItemDescription } from '../MapQuickAccessDesktopItem/MapQuickAccessDesktopItem.styled';

type MapQuickAccessDesktopCitiesToggleButtonProps = {
    isOpen: boolean;
};

export const MapQuickAccessDesktopCitiesToggleButton = styled.div<MapQuickAccessDesktopCitiesToggleButtonProps>`
    position: relative;

    ${({ isOpen }) =>
        isOpen &&
        css`
            ${MapQuickAccessDesktopItemDescription} {
                display: none !important;
            }
        `}
`;

type MapQuickAccessDesktopCitiesProps = {
    isOpen: boolean;
};

export const MapQuickAccessDesktopCities = styled.div<MapQuickAccessDesktopCitiesProps>`
    display: none;
    width: 23rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};

    ${({ isOpen }) =>
        isOpen && {
            display: 'block !important',
        }}
`;

export const MapQuickAccessDesktopCitiesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 1rem;
`;

export const MapQuickAccessDesktopCityItem = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 5rem;
    padding: 0.5rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    border: 0;
`;

export const MapQuickAccessDesktopCityItemImage = styled.div`
    width: 3.5rem;
    height: 3.5rem;
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    background-size: cover;
    background-position: center;
    border: 2px solid ${({ theme }) => theme.color.tertiary.light};
    border-radius: 100%;
`;

export const MapQuickAccessDesktopCityItemName = styled(Typography)`
    width: 100%;
    margin-top: 0.25rem;
`;
