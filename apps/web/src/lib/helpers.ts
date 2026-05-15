export function flatten<T>(array: T[][]): T[] {
    return (array ?? []).reduce((acc, val) => acc.concat(val), []);
}

export function removeEmptyStringAndNull<T extends Record<string, unknown>>(object: T): Partial<T> {
    const keys = Object.keys(object) as (keyof T)[];
    return keys.reduce<Partial<T>>((newItem, key) => {
        if (object[key] != null && object[key] !== '') {
            newItem[key] = object[key];
        }
        return newItem;
    }, {});
}
