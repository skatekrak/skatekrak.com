export default class ScrollHelper {
    public static getScrollContainer() {
        return document.getElementsByClassName('scroll-container')[0] as HTMLElement;
    }
}
