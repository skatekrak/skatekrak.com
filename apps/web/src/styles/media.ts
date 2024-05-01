/*
 * Based on 2020 stats
 * https://www.hobo-web.co.uk/best-screen-size/
 */
export enum ScreenSizes {
    mobile = 480,
    tablet = 768,
    laptopS = 1024, // Only exist in the codebase to arrange some details for transitioning from tablet to laptop
    laptop = 1280,
    laptopL = 1440,
    desktop = 1920,
    infinite = 2560,
}

export class Queries {
    public static readonly mobile = Queries.custom(ScreenSizes.mobile);

    public static readonly tablet = Queries.custom(ScreenSizes.tablet);

    public static readonly laptopS = Queries.custom(ScreenSizes.laptopS);

    public static readonly laptop = Queries.custom(ScreenSizes.laptop);

    public static readonly laptopL = Queries.custom(ScreenSizes.laptopL);

    public static readonly desktop = Queries.custom(ScreenSizes.desktop);

    public static readonly infinite = Queries.custom(ScreenSizes.infinite);

    public static custom(minWidth: number) {
        return `@media (min-width: ${minWidth}px)`;
    }
}

export default Queries;
