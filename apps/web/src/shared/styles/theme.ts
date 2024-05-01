import type { DefaultTheme } from 'styled-components/native';

export const defaultTheme: DefaultTheme = {
    borderRadius: 4,
    colors: {
        primary: {
            '80': '#FF3D38',
            '50': '#FF8380',
            '20': '#FFCDCC',
        },
        secondary: {
            '80': '#56AEFF',
            '50': '#80C2FF',
            '20': '#CCE7FF',
        },
        onLight: {
            high: 'rgba(31, 31, 31, 0.9)',
            medium: 'rgba(31, 31, 31, 0.7)',
            low: 'rgba(31, 31, 31, 0.35)',
            placeholder: 'rgba(31, 31, 31, 0.17)',
        },
        onDark: {
            high: 'rgba(255, 255, 255, 1.0)',
            medium: 'rgba(255, 255, 255, 0.7)',
            low: 'rgba(255, 255, 255, 0.40)',
            placeholder: 'rgba(255, 255, 255, 0.17)',
        },
        tertiary: {
            white: '#FFFFFF',
            dark: '#1F1F1F',
            medium: '#333333',
            light: '#4D4D4D',
        },
        system: {
            error: '#FF0F0F',
            success: '#26D971',
        },
    },
    shadows: {
        onLight: {
            low: {
                shadowColor: '#1F1F1F',
                shadowOpacity: 0.06,
                shadowOffset: {
                    width: 1,
                    height: 3,
                },
                shadowRadius: 24,
                elevation: 2,
            },
            medium: {
                shadowColor: '#1F1F1F',
                shadowOpacity: 0.1,
                shadowOffset: {
                    width: 1,
                    height: 4,
                },
                shadowRadius: 24,
                elevation: 6,
            },
            high: {
                shadowColor: '#1F1F1F',
                shadowOpacity: 0.16,
                shadowOffset: {
                    width: 1,
                    height: 5,
                },
                shadowRadius: 24,
                elevation: 10,
            },
            extremelyHigh: {
                shadowColor: '#1F1F1F',
                shadowOpacity: 0.32,
                shadowOffset: {
                    width: 1,
                    height: 5,
                },
                shadowRadius: 24,
                elevation: 16,
            },
            textLow: {
                shadowColor: '#000000',
                shadowOpacity: 0.25,
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowRadius: 2,
                elevation: 2,
            },
            textHigh: {
                shadowColor: '#000000',
                shadowOpacity: 0.5,
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowRadius: 2,
                elevation: 2,
            },
        },
        onDark: {
            low: {
                shadowColor: '#000000',
                shadowOpacity: 0.08,
                shadowOffset: {
                    width: 1,
                    height: 3,
                },
                shadowRadius: 24,
                elevation: 2,
            },
            medium: {
                shadowColor: '#000000',
                shadowOpacity: 0.14,
                shadowOffset: {
                    width: 1,
                    height: 4,
                },
                shadowRadius: 24,
                elevation: 6,
            },
            high: {
                shadowColor: '#000000',
                shadowOpacity: 0.24,
                shadowOffset: {
                    width: 1,
                    height: 5,
                },
                shadowRadius: 24,
                elevation: 10,
            },
            extremelyHigh: {
                shadowColor: '#000000',
                shadowOpacity: 0.4,
                shadowOffset: {
                    width: 1,
                    height: 5,
                },
                shadowRadius: 24,
                elevation: 16,
            },
            textLow: {
                shadowColor: '#000000',
                shadowOpacity: 0.25,
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowRadius: 2,
                elevation: 2,
            },
            textHigh: {
                shadowColor: '#000000',
                shadowOpacity: 0.5,
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowRadius: 2,
                elevation: 2,
            },
        },
    },
    typography: {
        heading1: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 97,
            lineHeight: 112,
            letterSpacing: -1.5,
        },
        heading2: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 60,
            lineHeight: 72,
            letterSpacing: -0.5,
        },
        heading3: {
            fontFamily: 'Roboto_400Regular',
            fontSize: 48,
            lineHeight: 56.25,
        },
        heading4: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 34,
            lineHeight: 39.84,
            letterSpacing: 0.25,
        },
        heading5: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 24,
            lineHeight: 29,
        },
        heading6: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 20,
            lineHeight: 24,
            letterSpacing: 0.25,
        },
        subtitle1: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 16,
            lineHeight: 19,
        },
        body1: {
            fontFamily: 'Roboto_400Regular',
            fontSize: 16,
            lineHeight: 19,
        },
        subtitle2: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 14,
            lineHeight: 16,
        },
        body2: {
            fontFamily: 'Roboto_400Regular',
            fontSize: 14,
            lineHeight: 16,
        },
        button: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 14,
            lineHeight: 16,
            textTransform: 'uppercase',
        },
        caption: {
            fontFamily: 'Roboto_500Medium',
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.4,
        },
        overline: {
            fontFamily: 'Roboto_400Regular',
            fontSize: 10,
            lineHeight: 16,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
        },
    },
};
