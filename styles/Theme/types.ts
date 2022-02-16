import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        color: {
            primary: {
                80: string;
                50: string;
                20: string;
            };
            secondary: {
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
            };
            onDark: {
                highEmphasis: string;
                mediumEmphasis: string;
                lowEmphasis: string;
                placeholder: string;
            };
            system: {
                error: string;
                success: string;
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
