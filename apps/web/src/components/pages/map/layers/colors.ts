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
