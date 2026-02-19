/**
 * Color constants for use in JavaScript/TypeScript (non-CSS) contexts.
 * For CSS styling, use Tailwind utility classes instead.
 *
 * Primary use case: Mapbox GL JS paint configuration.
 */

export const mapColors = {
    street: { default: '#E34444', dark: '#8A2828' },
    park: { default: '#50D4F1', dark: '#28798A' },
    shop: { default: '#5CE945', dark: '#368A28' },
    private: { default: '#E7D533', dark: '#8A8128' },
    diy: { default: '#D55CFF', dark: '#71288A' },
    rip: { default: '#FFFFFF', mid: '#CDCDCD', dark: '#8C8C8C' },
    wip: { default: '#FF791A', dark: '#93501F' },
} as const;

export const primaryColors = {
    100: '#BF2722',
    80: '#FF3D38',
    50: '#FF8380',
    20: '#FFCDCC',
} as const;

export const secondaryColors = {
    100: '#006ACC',
    80: '#56AEFF',
    50: '#80C2FF',
    20: '#CCE7FF',
} as const;

export const tertiaryColors = {
    white: '#FFFFFF',
    dark: '#1F1F1F',
    medium: '#333333',
    light: '#4D4D4D',
} as const;

export const systemColors = {
    error: '#F64C4C',
    success: '#26D971',
} as const;
