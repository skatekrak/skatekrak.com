/**
 * Create a linked list, linked by the `child` attribute
 * @param {Object[]} objects - List of objects to link
 */
export default function(objects) {
    const copy = objects;
    for (let i = copy.length - 1; i > 0; i -= 1) {
        copy[i - 1].child = copy[i];
    }
    return copy[0];
}
