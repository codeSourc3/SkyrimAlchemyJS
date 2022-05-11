/**
 * Capitalizes the first letter of every word in the provided string.
 * 
 * @param {string} string the string to turn to title case.
 * @returns 
 */
 export function toTitleCase(string) {
    if (typeof string !== 'string') {
        throw new TypeError(`toTitleCase expected ${string} to be a string, not a ${typeof string}.`);
    }
    const regex = /\w\S*/g;
    return string.replace(regex, txt => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
}

const listFormatter = new Intl.ListFormat(navigator.language);

export function formatListLocalized(array) {
    return listFormatter.format(array);
}

