export function flatten<T>(array: T[][]): T[] {
    return (array ?? []).reduce((acc, val) => acc.concat(val), []);
}

export function removeEmptyStringAndNull(object: any) {
    const keys = Object.keys(object);
    return keys.reduce((newItem, key) => {
        if (object[key] != null && object[key] !== '') {
            newItem[key] = object[key];
        }
        return newItem;
    }, {});
}
