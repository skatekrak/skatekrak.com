import Typography from 'components/Ui/typography/Typography';
import styled from 'styled-components';

export const Category = styled.div`
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
`;

type CategoryToggleButtonProps = {
    isOpen: boolean;
};

export const CategoryToggleButton = styled.button<CategoryToggleButtonProps>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 1.5rem;
    text-align: left1;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    border-top: 1px solid ${({ theme }) => theme.color.onDark.divider};

    & svg {
        width: 1.5rem;
        fill: ${({ theme }) => theme.color.onDark.lowEmphasis};
        transform: ${({ isOpen }) => (isOpen ? 'rotate(-90deg)' : 'rotate(90deg)')};
    }
`;

export const CategoryName = styled(Typography)`
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const MapsContainer = styled.div`
    display: grid;
    grid-gap: 0.5rem;
    padding: 0.5rem;
`;
