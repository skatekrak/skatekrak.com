/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
    darkMode: ['class'],
    content: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/pages/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            mobile: '480px',
            tablet: '768px',
            'laptop-s': '1024px',
            'laptop-m': '1200px',
            laptop: '1280px',
            'laptop-l': '1440px',
            desktop: '1920px',
            infinite: '2560px',
        },
        extend: {
            boxShadow: {
                onDarkLow: '1px 3px 24px 1px rgba(0, 0, 0, 0.08)',
                onDarkMedium: '1px 4px 24px 1px rgba(0, 0, 0, 0.14)',
                onDarkHigh: '1px 5px 24px 1px rgba(0, 0, 0, 0.24)',
                onDarkHighSharp: '0px 0px 4px 1px rgba(0, 0, 0, 0.2)',
                onDarkExtreme: '1px 5px 24px 1px rgba(0, 0, 0, 0.4)',
                onLightLow: '1px 3px 24px 1px rgba(31, 31, 31, 0.06)',
                onLightMedium: '1px 4px 24px 1px rgba(31, 31, 31, 0.1)',
                onLightHigh: '1px 5px 24px 1px rgba(31, 31, 31, 0.16)',
                onLightExtreme: '1px 5px 24px 1px rgba(31, 31, 31, 0.32)',
            },
            fontFamily: {
                roboto: ['roboto-regular"', 'helvetica"', 'Arial', 'sans-serif'],
                'roboto-bold': ['roboto-bold"', 'helvetica"', 'Arial', 'sans-serif'],
                'roboto-black': ['roboto-black"', 'helvetica"', 'Arial', 'sans-serif'],
                'roboto-black-italic': ['roboto-black-italic"', 'helvetica"', 'Arial', 'sans-serif'],
                'roboto-condensed': ['roboto-condensed-regular"', 'helvetica"', 'Arial', 'sans-serif'],
                'roboto-condensed-bold': ['roboto-condensed-bold"', 'helvetica"', 'Arial', 'sans-serif'],
                brush: ['dirty-brush"', 'helvetica"', 'Arial', 'sans-serif'],
                ink: ['inkfree"', 'helvetica"', 'Arial', 'sans-serif'],
            },
            colors: {
                primary: {
                    20: '#FFCDCC',
                    50: '#FF8380',
                    80: '#FF3D38',
                    100: '#BF2722',
                },
                secondary: {
                    20: '#CCE7FF',
                    50: '#80C2FF',
                    80: '#56AEFF',
                    100: '#006ACC',
                },
                tertiary: {
                    white: '#FFFFFF',
                    darker: '#0D0D0D',
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
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))',
                },
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.text-shadow-low': {
                    'text-shadow': '0px 0px 2px rgba(0, 0, 0, 0.25)',
                },
                '.text-shadow-high': {
                    'text-shadow': '0px 0px 2px rgba(0, 0, 0, 0.5)',
                },
            });
        }),
    ],
};
