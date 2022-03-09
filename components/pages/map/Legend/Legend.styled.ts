import styled from 'styled-components';

import media from 'styles/media';
import Typography from 'components/Ui/typography/Typography';

export const LegendContainer = styled.div`
    position: absolute;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: 27rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border-radius: 0.25rem;
    border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 1000;

    ${media.tablet} {
        left: 1.5rem;
        bottom: 1.5rem;
    }

    & .krak-close-button {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        z-index: 1;
    }
`;

export const LegendTrigger = styled.button`
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    display: flex;
    align-items: center;
    padding: 0.625rem 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 10;

    ${media.tablet} {
        left: 1.5rem;
        bottom: 1.5rem;
    }

    & svg {
        width: 1.75rem;
        height: 1.75rem;
        margin-right: 1rem;
        box-shadow: none;
    }
`;

export const LegendTitle = styled(Typography)`
    margin: 1.5rem;
    text-transform: uppercase;
`;

export const LegendScrollContainer = styled.div`
    padding: 0 1.5rem 2rem;
`;

export const LegendDescription = styled(Typography)`
    margin-bottom: 2rem;
    line-height: 1.4;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & a {
        color: ${({ theme }) => theme.color.primary[80]};
        text-decoration: underline;
    }
`;

export const LegendSectionTitle = styled(Typography)`
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.color.primary[80]};
`;

export const LegendSectionDivider = styled.div`
    height: 0.5px;
    margin: 1.5rem 0 1rem;
    background-color: ${({ theme }) => theme.color.onDark.divider};
`;

export const LegendSectionContainer = styled.ul`
    display: flex;
    flex-wrap: wrap;
`;

export const LegendCategory = styled.li`
    display: flex;
    align-items: center;
    width: 50%;
    margin-bottom: 0.5rem;

    &:last-child {
        margin-bottom: 0;
    }

    & svg {
        height: 1.75rem;
        width: 1.75rem;
        margin-right: 0.5rem;
    }
`;

export const LegendTag = styled.li`
    display: flex;
    align-items: center;
    margin-right: 1rem;

    &:last-child {
        margin-right: 0;
    }

    & svg {
        height: 1.25rem;
        width: 1.25rem;
        margin-right: 0.5rem;
    }
`;

export const LegendActivitiesContainer = styled(LegendSectionContainer)`
    justify-content: space-around;
`;

export const LegendActivity = styled.li`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;

    & .map-marker-activity {
        width: 2.25rem;
        height: 2.25rem;
        z-index: -1;

        &-inner {
            animation: none;
        }

        &-middle {
            animation: none;
        }

        &-outter {
            animation: none;
        }

        &-firing {
            transform: inherit;

            & .map-marker-activity-inner {
                transform: scale(0.3);
                opacity: 0.4;
            }

            & .map-marker-activity-middle {
                transform: scale(0.75);
                opacity: 0.3;
            }

            & .map-marker-activity-outter {
                transform: scale(1.2);
                opacity: 0.15;
            }
        }
    }

    &:last-child {
        & .map-marker-activity-inner {
            transform: scale(0.7);
            opacity: 0.4;
        }

        & .map-marker-activity-middle {
            transform: scale(1.2);
            opacity: 0.2;
        }

        & .map-marker-activity-outter {
            transform: scale(1.7);
            opacity: 0.2;
        }
    }
`;

export const LegendActivityMarker = styled.div`
    position: relative;
    width: 2.25rem;
    height: 3rem;
    z-index: 1;
`;

export const LegendActivityBadge = styled.div`
    position: absolute;
    top: -7px;
    left: calc(100% - 13px);
    display: flex;
    align-items: center;
    height: 1rem;
    width: 1rem;
    z-index: 1;
`;
