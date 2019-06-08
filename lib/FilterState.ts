export enum FilterState {
    SELECTED = 'SELECTED',
    LOADING_TO_SELECTED = 'LOADING_TO_SELECTED',
    LOADING_TO_UNSELECTED = 'LOADING_TO_UNSELECTED',
    UNSELECTED = 'UNSELECTED',
}

export class FilterStateUtil {
    public static isAllSelected(states: Iterable<FilterState>): boolean {
        for (const state of states) {
            if (!FilterStateUtil.isSelected(state)) {
                return false;
            }
        }
        return true;
    }

    public static isAllUnSelected(states: Iterable<FilterState>): boolean {
        for (const state of states) {
            if (FilterStateUtil.isSelected(state)) {
                return false;
            }
        }
        return true;
    }

    public static isSelected(state: FilterState): boolean {
        return state === FilterState.SELECTED || state === FilterState.LOADING_TO_SELECTED;
    }

    private constructor() {}
}
