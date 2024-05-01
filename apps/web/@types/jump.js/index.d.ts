declare module 'jump.js' {
    export default function jump(target: string | Element | number, opts?: Options): void;

    type TransitionFunc = (t: number, b: number, c: number, d: number) => number;

    interface Options {
        duration?: number;
        offset?: number;
        callback?(): void;
        easing?: TransitionFunc;
        a11y?: boolean;
        container?: HTMLElement;
    }
}
