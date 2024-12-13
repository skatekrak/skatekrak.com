/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/pages/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
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
            },
        },
    },
    plugins: [],
};
