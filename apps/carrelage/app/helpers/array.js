/**
 * Sort objects ascending by their `createdAt`
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {number} - Return the substraction of both createdAt
 */
function sortByCreatedAt(obj1, obj2) {
    return obj2.createdAt - obj1.createdAt;
}

/**
 * Map function than remove the `releaseDate` property if `elt` is a Media
 * @param {Object} elt - Element
 * @returns {Object} - Return the element
 */
function removeReleaseDate(elt) {
    const copy = elt;
    if (copy.className === 'media') {
        delete copy._doc.releaseDate;
    }
    return copy;
}

export default { sortByCreatedAt, removeReleaseDate };
