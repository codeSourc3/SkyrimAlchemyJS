export function intersection(setA, setB) {
    const _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

export function union(setA, setB) {
    const _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

export function difference(setA, setB) {
    const _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

/**
 * 
 * @param {any[]} arrayA 
 * @param {any[]} arrayB 
 * @returns {any[]}
 */
export function differenceArray(arrayA, arrayB) {
    return arrayA.filter(x => !arrayB.includes(x));
}

/**
 * 
 * @param {any[]} array 
 * @returns {Set<any>}
 */
export function toSet(array) {
    return new Set(array);
}

/**
 * 
 * @param {Iterable<any>} aSet 
 * @returns {any[]}
 */
export function toArray(aSet) {
    return Array.from(aSet);
}

/**
 * 
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
export function isWithin(value, min, max) {
    return value >= min && value <= max;
}