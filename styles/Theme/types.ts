import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        color: {
            primary: {
                100: string;
                80: string;
                50: string;
                20: string;
            };
            secondary: {
                100: string;
                80: string;
                50: string;
                20: string;
            };
            tertiary: {
                white: string;
                dark: string;
                medium: string;
                light: string;
            };
            onLight: {
                highEmphasis: string;
                mediumEmphasis: string;
                lowEmphasis: string;
                placeholder: string;
                divider: string;
            };
            onDark: {
                highEmphasis: string;
                mediumEmphasis: string;
                lowEmphasis: string;
                placeholder: string;
                divider: string;
            };
            system: {
                error: string;
                success: string;
            };
            map: {
                street: {
                    default: string;
                    dark: string;
                };
                park: {
                    default: string;
                    dark: string;
                };
                shop: {
                    default: string;
                    dark: string;
                };
                private: {
                    default: string;
                    dark: string;
                };
                diy: {
                    default: string;
                    dark: string;
                };
                rip: {
                    default: string;
                    mid: string;
                    dark: string;
                };
                wip: {
                    default: string;
                    dark: string;
                };
            };
        };
        shadow: {
            onText: {
                low: string;
                high: string;
            };
            onLight: {
                low: string;
                medium: string;
                high: string;
                extreme: string;
            };
            onDark: {
                low: string;
                medium: string;
                highSharp: string;
                high: string;
                extreme: string;
            };
        };
        typography: {
            fonts: {
                roboto: {
                    regular: string;
                    bold: string;
                    black: string;
                    blackItalic: string;
                    condensed: {
                        regular: string;
                        bold: string;
                    };
                };
                brush: string;
                ink: string;
            };
        };
    }
}
