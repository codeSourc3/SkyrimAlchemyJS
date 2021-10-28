import { Effect, Ingredient } from "../alchemy/ingredients.js";
import { ING_OBJ_STORE } from "./config.js";

/**
 * @typedef IngredientEntry
 * @property {string} dlc the downloadable content the ingredient belongs to.
 * @property {number[]} effects an array of IDs for the effects.
 * @property {number} goldValue the amount of gold the ingredient is worth.
 * @property {string} name the name of the ingredient.
 * @property {number} weight the weight of the ingredient.
 */

/** 
 * @callback upgradeHandler
 * @param {IDBVersionChangeEvent} ev
 * @returns {void}
 */

/**
 * 
 * @param {string} dbName the name of the database.
 * @param {upgradeHandler} upgradeHandler the upgrade handler.
 * @param {number} version the version of the database.
 * @returns {Promise<IDBDatabase>}
 */
export function openDB(dbName, upgradeHandler,version=1) {
    return new Promise((resolve, reject) => {
        const request = globalThis.indexedDB.open(dbName, version);
        request.onsuccess = (ev) => resolve(ev.target.result);
        request.onerror = ev => reject(ev.target.errorCode);
        request.onupgradeneeded = upgradeHandler;
    });
}



/**
 * Opens and closes a transaction to get an ingredient.
 * @param {IDBDatabase} db 
 * @param {string} names
 * @returns {Promise<Ingredient>}
 */
export function getIngredient(db, name) {
    const tx = db.transaction([ING_OBJ_STORE]);
    const ingObj = tx.objectStore(ING_OBJ_STORE);
    const getRequest = ingObj.get(name);
    const getIngredientPromise = new Promise(resolve => {
        getRequest.onsuccess = () => resolve(getRequest.result);
    });
    
    return getIngredientPromise;
    
}

/**
 * Tries to filter ingredients by name
 * @param {IDBDatabase} db the database
 * @param {string} searchText the search text.
 * @returns {Promise<Ingredient[]>}
 */
export function filterIngredientsByName(db, searchText, asc=true) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([ING_OBJ_STORE], 'readonly');
        const objectStore = transaction.objectStore(ING_OBJ_STORE);
        let result = [];
        startsWithIgnoreCase(objectStore, searchText, asc ? 'next': 'prev', (item) => {
            result.push(item.name);
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
        
    });
}

/**
 * 
 * @param {IDBDatabase} db 
 * @param {string} searchText 
 * @param {boolean} asc 
 * @returns {Promise<Ingredient[]>}
 */
export function filterIngredientsByEffect(db, searchText, asc=true) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(ING_OBJ_STORE, 'readonly');
        const objectStore = transaction.objectStore(ING_OBJ_STORE);
        const index = objectStore.index('effect_names');
        let results = [];
        startsWithIgnoreCase(index, searchText, asc ? 'next': 'prev', (item) => {
            results.push(item.name);
        }, err => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * 
 * @param {IDBIndex} index 
 * @param {string} needle 
 * @param {string} direction the direction of the cursor.
 * @param {(item:any) => any} onfound 
 * @param {(err?:Error) => void} onfinish 
 */
function startsWithIgnoreCase(index, needle, direction, onfound, onfinish) {
    const upperNeedle = needle.toUpperCase();
    const lowerNeedle = needle.toLowerCase();
    const cursorReq = index.openCursor(IDBKeyRange.bound('A', 'Z', false, false), direction);

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
 * 
 * @param {IDBDatabase} db 
 * @returns {Promise<Ingredient[]>}
 */
export function getAllIngredients(db) {
    const tx = db.transaction(ING_OBJ_STORE, 'readonly');
    const ingredientStore = tx.objectStore(ING_OBJ_STORE);
    const getIngredients = ingredientStore.getAll();
    const getIngredientsPromise = new Promise(resolve => {
        getIngredients.onsuccess = () => resolve(getIngredients.result);
    });

    return getIngredientsPromise;
}






/**
 * Adds an entry to the object store. This must take place
 * within an existing transaction. The await keyword
 * should not be used.
 * 
 * @param {IDBObjectStore} objStore 
 * @param {any} value 
 * @returns {Promise<IDBValidKey>}
 */
export function addEntry(objStore, value) {
    return new Promise((resolve, reject) => {
        const request = objStore.add(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}




/**
 * 
 * @param {IDBObjectStore} objStore 
 * @param {any} value 
 * @returns {Promise<IDBValidKey>}
 */
export function insertEntry(objStore, value) {
    return new Promise((resolve, reject) => {
        const request = objStore.put(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
