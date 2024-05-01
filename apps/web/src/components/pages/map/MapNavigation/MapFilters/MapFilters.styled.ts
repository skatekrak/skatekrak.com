import styled, { css } from 'styled-components';

import { Status, Types } from '@krak/carrelage-client';

export const MapFiltersContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
`;

type MapFilterProps = {
    filter: Types | Status;
    isActive: boolean;
    isLoading: boolean;
};

export const MapFilterContainer = styled.button<MapFilterProps>`
    position: relative;
    display: flex;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 0.5rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    background-clip: padding-box;
    border: solid 1.5px transparent;
    border-radius: 0.2rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};

    &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: -1.5px;
        border-radius: inherit;
        z-index: -1;
        ${({ theme, isActive, isLoading, filter }) =>
            !isActive || isLoading
                ? `
            background: ${theme.color.tertiary.light}`
                : (filter === 'street' &&
                      `
                        background: linear-gradient(${theme.color.map.street.default}, ${theme.color.map.street.dark})`) ||
                  (filter === 'park' &&
                      `
                        background: linear-gradient(${theme.color.map.park.default}, ${theme.color.map.park.dark})`) ||
                  (filter === 'diy' &&
                      `
                        background: linear-gradient(${theme.color.map.diy.default}, ${theme.color.map.diy.dark})`) ||
                  (filter === 'private' &&
                      `
                        background: linear-gradient(${theme.color.map.private.default}, ${theme.color.map.private.dark})`) ||
                  (filter === 'shop' &&
                      `
                        background: linear-gradient(${theme.color.map.shop.default}, ${theme.color.map.shop.dark})`) ||
                  (filter === 'wip' &&
                      `
                        background: linear-gradient(${theme.color.map.wip.default}, ${theme.color.map.wip.dark})`) ||
                  (filter === 'rip' &&
                      `
                        background: linear-gradient(${theme.color.map.rip.default}, ${theme.color.map.rip.dark})`)};
    }

    &:last-child {
        margin-right: 0;
    }

    & svg {
        width: 1.75rem;
        margin: auto;

        ${({ theme, isActive }) =>
            !isActive &&
            css`
                .map-icon-street-fill,
                .map-icon-park-fill,
                .map-icon-diy-fill,
                .map-icon-private-fill,
                .map-icon-shop-fill,
                .map-icon-wip-fill,
                .map-icon-rip-fill,
                .map-icon-wip-details,
                .details {
                    fill: ${theme.color.tertiary.medium};
                }
                & .map-icon-stroke-outter {
                    fill: ${theme.color.tertiary.light};
                }
            `}

        ${({ theme, isLoading }) =>
            isLoading &&
            css`
                width: 1.25rem;

                & .path {
                    stroke-width: 4px;
                    stroke: ${theme.color.tertiary.light};
                }
            `}
    }
`;
