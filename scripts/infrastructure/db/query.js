/**
 * 
 * @param {IDBIndex} index 
 * @param {string} needle 
 * @param {string} direction the direction of the cursor.
 * @param {(item:any) => any} onfound 
 * @param {(err?:Error) => void} onfinish 
 */
 export function startsWithIgnoreCase(index, needle, direction, onfound, onfinish) {
    console.debug('Needle: ', needle, 'Direction: ', direction);
    const upperNeedle = needle.toUpperCase();
    const lowerNeedle = needle.toLowerCase();
    const cursorReq = index.openCursor(null, direction);

    const nextCasing = (key, lowerKey) => {
        const length = Math.min(key.length, lowerNeedle.length); // lowerNeedle is from outer scope
        let llp = -1; // "llp = least lowerable position"

        // Iterate through the most common first chars for cursor.key and needle.
        for (let i = 0; i < length; ++i) {
            let lwrKeyChar = lowerKey[i];

            if (lwrKeyChar !== lowerNeedle[i]) {
                // The char at position i differs between the found key and needle being
                // looked for when just doing case insensitive match.
                // Now check how they differ and how to trace next casing from this:
                if (key[i] < upperNeedle[i]) {
                    // We could just append the UPPER version of the key we're looking for
                    // since found key is less than that.
                    return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
                }

                if (key[i] < lowerNeedle[i]) {
                    // Found key is between lower and upper version. Lets first append a
                    // lowercase char and the rest as uppercase.
                    return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
                }

                if (llp >= 0) {
                    // Found key is beyond this key. Need to rewind to last lowerable
                    // position and return key + 1 lowercase char + uppercase rest.
                    return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1)
                }

                // There are no lowerable positions - all chars are already lowercase
                // (or non-lowerable chars such as space, periods etc)

                return null;
            }

            if (key[i] < lwrKeyChar) {
                // Making lowercase of this char would make it appear after key.
                // Therefore set llp = i.
                llp = i;
            }
        }

        // All first common chars of found key and the key we're looking for are equal
        // when ignoring case.
        if (length < lowerNeedle.length) {
            // key was shorter than needle, meaning that we may look for key + UPPERCASE
            // version of the rest of needle.
            return key + upperNeedle.substr(key.length);
        }

        // Found key was longer than the key we're looking for
        if (llp < 0) {
            // ...and there is no way to make key we're looking for appear after found key.
            return null;
        } else {
            // There is a position of a char, that if we make that char lowercase,
            // needle will become greater than found key.
            return key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
        }
    };
    cursorReq.onsuccess = (e) => {
        const cursor = cursorReq.result;
        if (!cursor) {
            onfinish();
            return;
        }

        
        const key = cursor.key;
        if (typeof key !== 'string') {
            cursor.continue();
            return;
        }
        const lowerKey = key.toLowerCase();
        if (lowerKey.startsWith(lowerNeedle)) {
            onfound(cursor.value);
            cursor.continue();
        } else {
            // Derive least possible casing to appear after key in sort order.
            const nextNeedle = nextCasing(key, lowerKey, upperNeedle, lowerNeedle);
            console.info('Next needle', nextNeedle);
            if (nextNeedle) {
                cursor.continue(nextNeedle);
            } else {
                onfinish();
            }
        }
    };
    cursorReq.onerror = e => {
        onfinish(cursorReq.error);
    };
}

/**
 * Finds entries whose key starts with the prefix.
 * 
 * @param {IDBIndex} index 
 * @param {string} prefix 
 * @param {string} direction 
 * @param {onFoundCb} onfound 
 * @param {onFinishCb} onfinish 
 */
export function startsWithOrderable(index, prefix, direction, onfound, onfinish) {
    const cursorReq = index.openCursor(null, direction);
    cursorReq.onsuccess = ev => {
        const cursor = cursorReq.result;
        if (cursor) {
            // Cursor has not reached end.
            let currentKey = cursor.key;
            if (typeof currentKey !== 'string') {
                onfinish();
                return;
            }
            
            let capitalizedPrefix = prefix.replace(prefix.charAt(0), prefix.charAt(0).toUpperCase());
            console.debug(`Prefix: ${prefix} -> ${capitalizedPrefix}`);
            if ((currentKey.startsWith(prefix) || currentKey.startsWith(capitalizedPrefix))) {
                onfound(cursor.value, currentKey);
            }
            cursor.continue();
        } else {
            // Reached the end of the records.
            onfinish();
        }
    };
    cursorReq.onerror = err => {
        const domError = cursorReq.error;
        onfinish(domError);
    };
}

/**
 * 
 * @param {IDBObjectStore} objStore 
 * @param {string} prefix 
 * @param {string} direction
 * @param {onFoundCb} onFound 
 * @param {onFinishCb} onFinish 
 */
export function startsWith(objStore, prefix, direction, onFound, onFinish) {
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
            onFinish();
        }
    };
    cursorReq.onerror = err => {
        onFinish(cursorReq.error);
    };
}

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