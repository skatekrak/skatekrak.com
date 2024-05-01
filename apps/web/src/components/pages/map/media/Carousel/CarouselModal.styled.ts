import styled from 'styled-components';
import { themeData } from '@/styles/Theme/ThemeStore';
import media from '@/styles/media';

export const Overlay: React.CSSProperties = {
    position: 'absolute',
    background: 'rgba(31, 31, 31, 0.5)',
};

export const Modal: React.CSSProperties = {
    padding: '0',
    color: `${themeData.color.onDark.highEmphasis}`,
    background: `${themeData.color.tertiary.dark}`,
    border: `1px solid ${themeData.color.tertiary.medium}`,
    borderRadius: '0.25rem',
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
};

export const CloseButton: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    backgroundColor: `${themeData.color.onDark.divider}`,
    borderRadius: '50%',
};

export const CloseIcon: React.CSSProperties = {
    width: '1.5rem',
    height: '1.25rem',
    fill: `${themeData.color.onDark.mediumEmphasis}`,
};

export const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    ${media.laptopS} {
        min-height: inherit;
        height: inherit;
        aspect-ratio: 16 / 9;
        width: 88vw;
        max-width: 80rem;
    }
`;
