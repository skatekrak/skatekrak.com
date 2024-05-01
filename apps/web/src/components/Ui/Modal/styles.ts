import { themeData } from '@/styles/Theme/ThemeStore';

/** theme styles */
export const modalThemeStyles: Record<string, React.CSSProperties> = {
    overlay: {
        position: 'absolute',
        background: 'rgba(31, 31, 31, 0.5)',
    },
    modal: {
        padding: '0',
        color: `${themeData.color.onDark.highEmphasis}`,
        background: `${themeData.color.tertiary.dark}`,
        border: `1px solid ${themeData.color.tertiary.medium}`,
        borderRadius: '0.25rem',
        boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
    },
    closeButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.75rem',
        height: '1.75rem',
        backgroundColor: `${themeData.color.onDark.divider}`,
        borderRadius: '50%',
    },
    closeIcon: {
        width: '1.5rem',
        height: '1.25rem',
        fill: `${themeData.color.onDark.mediumEmphasis}`,
    },
};
