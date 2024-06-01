/**
 * Private methods
 * @param {String[]} elements -
 * @param {String[]} defaultValues - defaults values
 * @return {String} - Joined string ready to use as .select in query
 */
function generateSelect(elements, defaultValues) {
    let selects = elements || defaultValues;
    selects = selects.concat(defaultValues);

    defaultValues.forEach((value) => {
        const substr = value.substring(1, value.length);
        if (selects.includes(substr)) {
            delete selects[selects.indexOf(substr)];
            delete selects[selects.indexOf(value)];
        }
    });

    selects = [...new Set(selects)];
    return selects.join(' ');
}

export default generateSelect;
