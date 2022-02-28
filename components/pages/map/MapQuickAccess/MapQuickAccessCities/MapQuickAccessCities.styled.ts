import styled, { css } from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import { MapQuickAccessItemDescription } from '../MapQuickAccessItem/MapQuickAccessItem.styled';

type MapQuickAccessCitiesToggleButtonProps = {
    isOpen: boolean;
};

export const MapQuickAccessCitiesToggleButton = styled.div<MapQuickAccessCitiesToggleButtonProps>`
    position: relative;

    ${({ isOpen }) =>
        isOpen &&
        css`
            ${MapQuickAccessItemDescription} {
                display: none !important;
            }
        `}
`;

type MapQuickAccessCitiesProps = {
    isOpen: boolean;
};

export const MapQuickAccessCities = styled.div<MapQuickAccessCitiesProps>`
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

export const MapQuickAccessCitiesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 1rem;
`;

export const MapQuickAccessCityItem = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 5rem;
    padding: 0.5rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    border: 0;
`;

export const MapQuickAccessCityItemImage = styled.div`
    width: 3.5rem;
    height: 3.5rem;
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    background-size: cover;
    background-position: center;
    border: 2px solid ${({ theme }) => theme.color.tertiary.light};
    border-radius: 100%;
`;

export const MapQuickAccessCityItemName = styled(Typography)`
    width: 100%;
    margin-top: 0.25rem;
`;
