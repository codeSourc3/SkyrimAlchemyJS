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

export function maxBy(arr, fn) {
    // found from 30secondsofcode.org. Arrow function originally.
    return Math.max(...arr.map(typeof fn === 'function' ? fn : val => val[fn]));
}

/**
 * 
 * @param {any[]} arr 
 * @param {(element: object) => number | bigint} fn 
 * @returns {number | bigint}
 */
export function sumBy(arr, fn) {
    let mapped = arr.map(typeof fn === 'function' ? fn : val => val[fn]);
    return mapped.reduce((acc, val) => acc + val, 0);
}

/**
 * 
 * @param {any[]} a 
 * @param {any[]} b 
 * @param {(element: any) => any} fn 
 * @returns {any[]}
 */
export function intersectionBy(a, b, fn) {
    const s = new Set(b.map(fn));
    return Array.from(new Set(a)).filter(x => s.has(fn(x)));
}