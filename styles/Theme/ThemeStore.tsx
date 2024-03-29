import React from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';

export const themeData: DefaultTheme = {
    color: {
        primary: {
            100: '#BF2722',
            80: '#FF3D38',
            50: '#FF8380',
            20: '#FFCDCC',
        },
        secondary: {
            100: '#006ACC',
            80: '#56AEFF',
            50: '#80C2FF',
            20: '#CCE7FF',
        },
        tertiary: {
            white: '#FFFFFF',
            dark: '#1F1F1F',
            medium: '#333333',
            light: '#4D4D4D',
        },
        onLight: {
            highEmphasis: 'rgba(31, 31, 31, 0.9)',
            mediumEmphasis: 'rgba(31, 31, 31, 0.7)',
            lowEmphasis: 'rgba(31, 31, 31, 0.35)',
            placeholder: 'rgba(31, 31, 31, 0.17)',
            divider: 'rgba(31, 31, 31, 0.05)',
        },
        onDark: {
            highEmphasis: 'rgba(255, 255, 255, 1)',
            mediumEmphasis: 'rgba(255, 255, 255, 0.7)',
            lowEmphasis: 'rgba(255, 255, 255, 0.4)',
            placeholder: 'rgba(255, 255, 255, 0.17)',
            divider: 'rgba(255, 255, 255, 0.08)',
        },
        system: {
            error: '#F64C4C',
            success: '#26D971',
        },
        map: {
            street: {
                default: '#E34444',
                dark: '#8A2828',
            },
            park: {
                default: '#50D4F1',
                dark: '#28798A',
            },
            shop: {
                default: '#5CE945',
                dark: '#368A28',
            },
            private: {
                default: '#E7D533',
                dark: '#8A8128',
            },
            diy: {
                default: '#D55CFF',
                dark: '#71288A',
            },
            rip: {
                default: '#FFFFFF',
                mid: '#CDCDCD',
                dark: '#8C8C8C',
            },
            wip: {
                default: '#FF791A',
                dark: '#93501F',
            },
        },
    },
    shadow: {
        onText: {
            low: '0px 0px 2px rgba(0, 0, 0, 0.25)',
            high: '0px 0px 2px rgba(0, 0, 0, 0.5)',
        },
        onLight: {
            low: '1px 3px 24px 1px rgba(31, 31, 31, 0.06)',
            medium: '1px 4px 24px 1px rgba(31, 31, 31, 0.1)',
            high: '1px 5px 24px 1px rgba(31, 31, 31, 0.16)',
            extreme: '1px 5px 24px 1px rgba(31, 31, 31, 0.32)',
        },
        onDark: {
            low: '1px 3px 24px 1px rgba(0, 0, 0, 0.08)',
            medium: '1px 4px 24px 1px rgba(0, 0, 0, 0.14)',
            high: '1px 5px 24px 1px rgba(0, 0, 0, 0.24)',
            highSharp: '0px 0px 4px 1px rgba(0, 0, 0, 0.2)',
            extreme: '1px 5px 24px 1px rgba(0, 0, 0, 0.4)',
        },
    },
    typography: {
        fonts: {
            roboto: {
                regular: '"roboto-regular", "helvetica", "Arial", sans-serif',
                bold: '"roboto-bold", "helvetica", "Arial", sans-serif',
                black: '"roboto-black", "helvetica", "Arial", sans-serif',
                blackItalic: '"roboto-black-italic", "helvetica", "Arial", sans-serif',
                condensed: {
                    regular: '"roboto-condensed-regular", "helvetica", "Arial", sans-serif',
                    bold: '"roboto-condensed-bold", "helvetica", "Arial", sans-serif',
                },
            },
            brush: '"dirty-brush", "helvetica", "Arial", sans-serif',
            ink: '"inkfree", "helvetica", "Arial", sans-serif',
        },
    },
};

const ThemeStore: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <ThemeProvider theme={themeData}>{children}</ThemeProvider>
);

export { ThemeStore };
