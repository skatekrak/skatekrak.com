import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import media from 'styles/media';

export const MapQuickAccessDesktopContainer = styled.div`
    display: none;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 1000;

    ${media.laptopS} {
        display: flex;
    }

    & > div[data-tippy-root] {
        transform: none !important;
        inset: inherit !important;
        top: 0 !important;
        right: 4.5rem !important;
    }
`;

export const MapQuickAccessDesktopSectionTitle = styled(Typography)`
    flex-shrink: 0;
    margin: 0 0.75rem;
    margin-bottom: 0.375rem;
    text-align: center;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const MapQuickAccessDesktopSectionDivider = styled.div`
    flex-shrink: 0;
    height: 1px;
    width: calc(100% - 1.5rem);
    margin: 0.75rem;
    background-color: ${({ theme }) => theme.color.onDark.divider};
`;
