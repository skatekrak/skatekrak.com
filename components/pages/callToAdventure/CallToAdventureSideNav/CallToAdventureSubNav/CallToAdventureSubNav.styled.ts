import styled from 'styled-components';
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
