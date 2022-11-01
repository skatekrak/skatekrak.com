import styled, { css } from 'styled-components';
import { CallToAdventureSideNavLink } from '../CallToAdventureSideNav.styled';

export const CallToAdventureSubNav = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CallToAdventureSubNavOptions = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 0.75rem;

    ${CallToAdventureSideNavLink} {
        padding: 0.5rem;
        font-size: 0.875rem;
    }
`;

export const CallToAdventureSubNavToggle = styled(CallToAdventureSideNavLink)`
    display: flex;
    align-items: center;

    &:hover {
        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }

    ${({ isActive }) =>
        isActive &&
        css`
            & svg {
                transform: rotate(90deg);
            }
        `}

    & svg {
        width: 1.25rem;
        margin-left: auto;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;
