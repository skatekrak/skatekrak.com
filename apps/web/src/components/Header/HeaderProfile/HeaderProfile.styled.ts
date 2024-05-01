import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';
import { SecondaryNavItem } from '../Header.styled';

export const HeaderProfileButton = styled(SecondaryNavItem)`
    padding: 0.25rem;
    margin-left: 0.5rem;
    margin-right: 0 !important;
`;

export const HeaderProfileContainer = styled.div`
    flex-shrink: 0;
    margin: auto;
    border-radius: 100%;
`;

export const HeaderProfileMenuUsername = styled(Typography)`
    padding: 0.375rem 1rem;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const HeaderProfileMenuItem = styled.button`
    width: 100%;
    padding: 0.375rem 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    text-align: left;

    &:hover {
        background-color: ${({ theme }) => theme.color.tertiary.medium};
    }
`;
