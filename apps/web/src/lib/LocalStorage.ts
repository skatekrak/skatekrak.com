import { Source } from 'rss-feed';

export function isSourceSelected(source: Source): boolean {
    const str = localStorage.getItem(String(source.id));
    if (str) {
        const isSelected: boolean = JSON.parse(str);
        return isSelected;
    }
    return true;
}

export function saveSourceState(source: Source, isSelected: boolean): void {
    const str = JSON.stringify(isSelected);
    localStorage.setItem(String(source.id), str);
}
