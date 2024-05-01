export function push<T>(array: T[], element: T): T[] {
    const copy = Array.from(array);
    copy.push(element);
    return copy;
}

export function remove<T>(array: T[], index: number): T[] {
    const copy = Array.from(array);
    copy.splice(index, 1);
    return copy;
}
