import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';

export const LegendContainer = styled.div`
    padding: 0.5rem 1.5rem 2rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
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

type LegendSectionDividerProps = {
    marginTop?: string;
};

export const LegendSectionDivider = styled.div<LegendSectionDividerProps>`
    height: 0.5px;
    margin: 1.5rem 0 1rem;
    ${({ marginTop }) => marginTop && `margin-top: ${marginTop}`};
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
    margin-bottom: 0.75rem;
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

    & .map-badge {
        width: 100%;
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
