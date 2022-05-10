import styled, { css } from 'styled-components';
import { Status, Types } from 'lib/carrelageClient';
type SpotMarkSmallProps = {
    filter: Types | Status;
};

export const SpotMarkSmall = styled.div<SpotMarkSmallProps>`
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 0.625rem;

    background-color: ${({ theme, filter }) => {
        switch (filter) {
            case Types.Diy:
                return theme.color.map.diy.default;
            case Types.Park:
                return theme.color.map.park.default;
            case Types.Private:
                return theme.color.map.private.default;
            case Types.Shop:
                return theme.color.map.shop.default;
            case Types.Street:
                return theme.color.map.street.default;
            case Status.Wip:
                return theme.color.map.wip.default;
            case Status.Rip:
                return theme.color.map.rip.default;
            default:
                return theme.color.tertiary.light;
        }
    }};
`;
