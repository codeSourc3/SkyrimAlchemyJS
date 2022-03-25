import { toTitleCase } from "../strings.js";
import { isNullish } from "../utils.js";

const Direction = Object.freeze({
    PREV: 'prev',
    NEXT: 'next'
});

/**
 * Finds all records in the provided object store matching the prefix.
 * Sorts based on the direction given.
 * @param {IDBObjectStore} objStore an object store or an IDBIndex.
 * @param {string} prefix the string to search for.
 * @param {string} direction the direction ("prev" or "next") the cursor should travel.
 * @param {onFoundCb} onFound a function to call for each found item.
 * @param {onFinishCb} onFinish a function to call when we're finished searching.
 */
export function startsWith(objStore, prefix, direction, onFound, onFinish) {
    console.time('startsWith');
    const titleCasePrefix = toTitleCase(prefix);
    const keyRange = IDBKeyRange.bound(titleCasePrefix, titleCasePrefix + '\uffff', false, false);
    const cursorReq = objStore.openCursor(keyRange, direction);
    cursorReq.onsuccess = (e) => {
        const cursor = cursorReq.result;
        if (cursor) {
            
            onFound(cursor.value, cursor.key);
            console.debug('Is source an index', cursor.source instanceof IDBIndex);
            cursor.continue();
        } else {
            console.timeEnd('startsWith');
            onFinish();
        }
    };
    cursorReq.onerror = err => {
        console.timeEnd('startsWith');
        err.stopPropagation();
        onFinish(cursorReq.error);
    };
}

/**
 * 
 * @param {IDBObjectStore | IDBIndex} objStore 
 * @param {string} str 
 * @param {string} direction 
 * @param {onFoundCb} onFound 
 * @param {onFinishCb} onFinish 
 */
export function equals(objStore, str, direction, onFound, onFinish) {
    const cursorReq = objStore.openCursor(null, direction);
    cursorReq.addEventListener('success', e => {
        const cursor = cursorReq.result;
        if (cursor) {
            let potentialMatch = cursor.key;
            if (potentialMatch === str) {
                onFound(cursor.value, potentialMatch);
            }
            cursor.continue();
        } else {
            onFinish();
        }
    });

    cursorReq.addEventListener('error', e => {
        e.stopPropagation();
        const error = cursorReq.error;
        onFinish(error);
    });
}

/**
 * 
 * @param {IDBObjectStore | IDBIndex} objStore 
 * @param {IDBKeyRange} keyRange 
 * @param {"next" | "prev"} direction
 * @param {predicateCB} predicate 
 * @param {onFoundCb} onFound 
 * @param {onFinishCb} onFinish 
 */
export function filterBy(objStore, keyRange, direction, predicate, onFound, onFinish) {
    let range = !isNullish(keyRange) ? keyRange : null;
    const cursorReq = objStore.openCursor(range, direction);
    cursorReq.addEventListener('success', e => {
        const cursor = cursorReq.result;
        if (cursor) {
            let currentKey = cursor.key;
            let currentValue = cursor.value;
            if (predicate(currentValue, currentKey)) {
                onFound(currentValue, currentKey);
            }
            cursor.continue();
        } else {
            onFinish();
        }
    });

    cursorReq.addEventListener('error', e => {
        e.stopPropagation();
        const error = cursorReq.error;
        onFinish(error);
    });
}

/**
 * Returns a comparator function.
 * @param {string} direction 
 * @returns {compareFn}
 */
function createDBComparator(direction=Direction.NEXT) {
    return (a, b) => {
        return globalThis.indexedDB.cmp(a, b) * (direction === Direction.PREV ? -1 : 1);
    };
}

function simpleComparator(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * 
 * @param {IDBObjectStore | IDBIndex} index 
 * @param {any[]} keysToFind 
 * @param {string} direction 
 * @param {onFoundCb} onFound 
 * @param {onFinishCb} onFinish 
 */
export function equalsAnyOf(index, keysToFind, direction, onFound, onFinish) {
    const sortingFunction = simpleComparator;
    const sortedSet = keysToFind.sort(sortingFunction);
    let i = 0;
    const cursorReq = index.openCursor();
    cursorReq.addEventListener('success', (e) => {
        const cursor = cursorReq.result;
        if (!cursor) {
            onFinish();
            return;
        }
        const key = cursor.key;
        while (key > sortedSet[i]) {
            ++i;
            if (i === sortedSet.length) {
                onFinish();
                return;
            }
        }

        if (key === sortedSet[i]) {
            onFound(cursor.value.name);
            cursor.continue();
        } else {
            cursor.continue(sortedSet[i]);
        }
    });
    cursorReq.addEventListener('error', e => {
        e.stopPropagation();
        const error = cursorReq.error;
        onFinish(error);
    })
}





/**
 * @callback onFoundCb
 * @param {*} entry the value of the entry found.
 * @param {string?} key the key of the entry. 
 */

/**
 * @callback onFinishCb
 * @param {DOMException?} err
 * @returns {void}
 */

/**
 * @callback compareFn
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */

/**
 * @callback predicateCB
 * @param {*} value the value of the cursor entry.
 * @param {IDBValidKey} key the key of the cursor entry.
 * @returns {boolean} true if the predicate matches and false otherwise.
 */