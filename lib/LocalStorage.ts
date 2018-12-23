import { Source } from 'rss-feed';

export default class LocalStorage {
    public static isSourceSelected(source: Source): boolean {
        const str = localStorage.getItem(source.id);
        if (str) {
            const isSelected: boolean = JSON.parse(str);
            return isSelected;
        }
        return true;
    }

    public static saveSourceState(source: Source, isSelected: boolean): void {
        const str = JSON.stringify(isSelected);
        localStorage.setItem(source.id, str);
    }
}
