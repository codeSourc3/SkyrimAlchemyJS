import { logger } from "../logger";



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
    logger.time('startsWith');
    const titleCasePrefix = toTitleCase(prefix);
    const keyRange = IDBKeyRange.bound(titleCasePrefix, titleCasePrefix + '\uffff', false, false);
    const cursorReq = objStore.openCursor(keyRange, direction);
    cursorReq.onsuccess = (e) => {
        const cursor = cursorReq.result;
        if (cursor) {
            
            onFound(cursor.value, cursor.key);
            logger.debug('Is source an index', cursor.source instanceof IDBIndex);
            cursor.continue();
        } else {
            logger.timeEnd('startsWith');
            onFinish();
        }
    };
    cursorReq.onerror = err => {
        logger.timeEnd('startsWith');
        onFinish(cursorReq.error);
    };
}

/**
 * Capitalizes the first letter of every word in the provided string.
 * 
 * @param {string} string the string to turn to title case.
 * @returns 
 */
function toTitleCase(string) {
    if (typeof string !== 'string') {
        throw new TypeError(`toTitleCase expected ${string} to be a string, not a ${typeof string}.`);
    }
    const regex = /\w\S*/g;
    return string.replace(regex, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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