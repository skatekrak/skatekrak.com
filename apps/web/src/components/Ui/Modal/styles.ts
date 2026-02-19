/** theme styles */
export const modalThemeStyles: Record<string, React.CSSProperties> = {
    overlay: {
        position: 'absolute',
        background: 'rgba(31, 31, 31, 0.5)',
    },
    modal: {
        padding: '0',
        color: 'rgba(255, 255, 255, 1)',
        background: '#1F1F1F',
        border: '1px solid #333333',
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
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
    },
    closeIcon: {
        width: '1.5rem',
        height: '1.25rem',
        fill: 'rgba(255, 255, 255, 0.7)',
    },
};
