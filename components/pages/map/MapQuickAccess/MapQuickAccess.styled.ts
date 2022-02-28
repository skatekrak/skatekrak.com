import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';

export const MapQuickAccesscontainer = styled.div`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.75rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 1000;
`;

export const MapQuickAccessSectionTitle = styled(Typography)`
    flex-shrink: 0;
    margin: 0 0.75rem;
    margin-bottom: 0.375rem;
    text-align: center;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const MapQuickAccessSectionDivider = styled.div`
    flex-shrink: 0;
    height: 1px;
    width: calc(100% - 1.5rem);
    margin: 0.75rem;
    background-color: ${({ theme }) => theme.color.onDark.divider};
`;

export const MapQuickAccessCustomContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-height: calc(100vh - 24rem);
    overflow-y: auto;
    overflow-x: hidden;
`;
