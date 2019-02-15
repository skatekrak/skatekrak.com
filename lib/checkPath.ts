export function checkPath(base, path) {
    let current = base;
    const components = path.split('.');
    for (const component of components) {
        if (typeof current !== 'object' || !current.hasOwnProperty(component)) {
            return false;
        }
        current = current[component];
    }
    return true;
}
