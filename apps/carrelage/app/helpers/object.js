/**
 * Delete every undefined value in an object
 * @export
 * @param {any} obj
 * @returns
 */
function deleteUndefined(obj) {
    const copy = Object.assign({}, obj);
    const keys = Object.keys(copy);
    if (keys.length > 0) {
        keys.forEach((key) => {
            if (copy[key] === undefined) {
                delete copy[key];
            } else if (typeof copy[key] === 'object') {
                copy[key] = deleteUndefined(copy[key]);
            }
        });
    }
    return copy;
}

export default { deleteUndefined };
