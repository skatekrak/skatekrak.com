export enum FilterState {
    SELECTED = 'SELECTED',
    LOADING_TO_SELECTED = 'LOADING_TO_SELECTED',
    LOADING_TO_UNSELECTED = 'LOADING_TO_UNSELECTED',
    UNSELECTED = 'UNSELECTED',
}

export function isAllSelected(states: Iterable<FilterState>): boolean {
    for (const state of states) {
        if (!isSelected(state)) {
            return false;
        }
    }
    return true;
}

export function isAllUnSelected(states: Iterable<FilterState>): boolean {
    for (const state of states) {
        if (isSelected(state)) {
            return false;
        }
    }
    return true;
}

export function isSelected(state: FilterState): boolean {
    return state === FilterState.SELECTED || state === FilterState.LOADING_TO_SELECTED;
}

export function getSelected<T extends string>(sources: Record<T, FilterState>): T[] {
    const arr: T[] = [];
    for (const key in sources) {
        if (sources[key] === FilterState.LOADING_TO_SELECTED || sources[key] === FilterState.SELECTED) {
            arr.push(key);
        }
    }

    return arr;
}

export function getKeys<T extends string>(sources: Record<T, FilterState>): T[] {
    const arr: T[] = [];
    for (const key in sources) {
        arr.push(key);
    }
    return arr;
}
