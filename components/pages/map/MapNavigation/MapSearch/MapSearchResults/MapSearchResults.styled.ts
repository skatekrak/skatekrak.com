import Typography from 'components/Ui/typography/Typography';
import styled from 'styled-components';

export const MapSearchResultsContainer = styled.div`
    position: absolute;
    top: 3.75rem;
    left: 0;
    right: 0;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
`;

export const MapSearchResultsLoading = styled.div`
    display: flex;
    align-items: center;
    padding: 15px 16px 15px 12px;

    & span {
        display: block;
        border-radius: 0.125rem;
        background-color: ${({ theme }) => theme.color.onDark.placeholder};
    }

    & > .skeleton-circle {
        width: 2rem;
        height: 2rem;
        border-radius: 100%;
    }

    & > .skeleton-container-start {
        flex-grow: 1;
        margin-left: 12px;

        & > .skeleton-box {
            height: 0.625rem;
            width: 65%;

            &:first-child {
                margin-bottom: 0.5rem;
            }

            &:last-child {
                width: 80%;
            }
        }
    }

    & > .skeleton-container-end {
        margin-left: auto;
        width: 20%;

        & > .skeleton-box {
            height: 0.625rem;
            width: 100%;

            &:first-child {
                margin-bottom: 0.5rem;
            }
        }
    }
`;

export const MapSearchResultsNoContent = styled.div`
    padding: 1rem 2rem;
    text-align: center;

    & .ui-Typography:last-child {
        margin-top: 0.25rem;
        color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;

export const MapSearchResultSpot = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.625rem 1rem 0.625rem 0.5rem;
    text-align: inherit;
`;

export const MapSearchResultPlace = styled(MapSearchResultSpot)`
    & svg {
        width: 2rem !important;
        margin-left: 0.25rem !important;
    }

    & .ui-Typography {
        font-style: italic;
        color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;

export const MapSearchResultSpotIcon = styled.div`
    display: flex;
    flex-direction: column;

    & svg {
        margin: auto 0.5rem auto 0;
        width: 2.25rem;
    }
`;

export const MapSearchResultSpotMain = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
`;

export const MapSearchResultSpotName = styled(Typography)`
    letter-spacing: 0.2px;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
`;

export const MapSearchResultSpotStreet = styled(Typography)`
    margin-top: 0.125rem;
    font-style: italic;
    color: ${({ theme }) => theme.color.onDark.lowEmphasis};
`;

export const MapSearchResultSpotDetails = styled.div`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    max-width: 24%;
    margin-top: auto;
    margin-left: 1rem;
    overflow: hidden;
`;

export const MapSearchResultSpotCity = styled(Typography)`
    text-align: right;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const MapSearchResultSpotBadges = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0.25rem;

    & svg {
        width: 1rem;
        margin-right: 0.375rem;

        &:last-child {
            margin-right: 0;
        }
    }

    & .ui-Typography {
        color: ${({ theme }) => theme.color.onDark.lowEmphasis};
    }
`;

export const MapSearchResultSpotDivider = styled.div`
    height: 1px;
    background-color: ${({ theme }) => theme.color.onDark.divider};

    &:last-of-type {
        display: none;
    }
`;
