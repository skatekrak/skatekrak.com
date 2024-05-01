import type { TextStyle } from 'react-native';
import { CSSObject } from 'styled-components';

declare module 'styled-components/native' {
    type Elevation = {
        elevation: number;
    };

    type Emphasis = {
        high: string;
        medium: string;
        low: string;
        placeholder: string;
    };

    type MainColor = {
        '80': string;
        '50': string;
        '20': string;
    };

    type Shadow = Pick<CSSObject, 'shadowColor' | 'shadowOpacity' | 'shadowOffset' | 'shadowRadius' | 'elevation'>;
    type ShadowSet = {
        low: Shadow;
        medium: Shadow;
        high: Shadow;
        extremelyHigh: Shadow;
        textLow: Shadow;
        textHigh: Shadow;
    };

    export interface DefaultTheme {
        borderRadius: number;
        colors: {
            primary: MainColor;
            secondary: MainColor;
            tertiary: {
                white: string;
                dark: string;
                medium: string;
                light: string;
            };
            onLight: Emphasis;
            onDark: Emphasis;
            system: {
                error: string;
                success: string;
            };
        };
        shadows: {
            onLight: ShadowSet;
            onDark: ShadowSet;
        };
        typography: {
            heading1: TextStyle;
            heading2: TextStyle;
            heading3: TextStyle;
            heading4: TextStyle;
            heading5: TextStyle;
            heading6: TextStyle;
            subtitle1: TextStyle;
            body1: TextStyle;
            subtitle2: TextStyle;
            body2: TextStyle;
            button: TextStyle;
            caption: TextStyle;
            overline: TextStyle;
        };
    }
}
