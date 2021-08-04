import { Effect, Ingredient } from "../alchemy/ingredients.js";
import { ING_OBJ_STORE, EFFECT_OBJ_STORE } from "./config.js";

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
 * Starts a transaction and gets the object store.
 * @param {IDBDatabase} db
 * @param {string} storeName 
 * @param {string} mode either "readonly" or "readwrite"
 * @returns {IDBObjectStore}
 */
export function getObjectStore(db, storeName, mode) {
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
}

/**
 * 
 * @param {IDBDatabase} db 
 * @param {string[]} storeNames 
 * @param {string} mode 
 */
export function openTransaction(db, storeNames, mode) {
    const tx = db.transaction(storeNames, mode);
    let stores = Array.from(tx.objectStoreNames).map(name => tx.objectStore(name));
    //tx.onabort = () => console.error('Transaction error: ', tx.error);
    return stores;
}

/**
 * Opens and closes a transaction to get an ingredient.
 * @param {IDBDatabase} db 
 * @param {string} names
 */
export function getIngredient(db, name) {
    const tx = db.transaction([ING_OBJ_STORE, EFFECT_OBJ_STORE]);
    const ingObj = tx.objectStore(ING_OBJ_STORE);
    const effObj = tx.objectStore(EFFECT_OBJ_STORE);
    const getRequest = ingObj.get(name);
    const getPromise = new Promise(resolve => {
        getRequest.onsuccess = () => resolve(getRequest.result);
    });
    
    getPromise.then(ingredient => {
        console.info('Ingredient: ', ingredient);
        let effectPromises = ingredient.effects.map(id => {
            return new Promise(resolve => {
                const getEffect = effObj.get(id);
                getEffect.onsuccess = () => resolve(getEffect.result);
            });
        });
        const ingredientPromise = Promise.resolve(ingredient);
        return Promise.all([...effectPromises, ingredientPromise]);
    }).then(values => {
        // Effects should be found on indices 0, 1, 2, 3.
        // Ingredient should be found on index 4.
        console.assert(values.length === 5);

    })
    
}

/**
 * 
 * @param {{name:string, dlc: string, effects: number[], goldValue: number, weight: number}} ingredient 
 * @param {IDBObjectStore} effObj 
 * @returns {Promise<[Effect, Effect, Effect, Effect, {name: string, dlc: string, effects:number, goldValue: number, weight:number}]>}
 */
function getEffectsFromIngredient(ingredient, effObj) {
    let effectPromises = ingredient.effects.map(id => {
        return new Promise(resolve => {
            const getEffect = effObj.get(id);
            getEffect.onsuccess = () => resolve(getEffect.result);
        });
    });
    const ingredientPromise = Promise.resolve(ingredient);
    return Promise.all([...effectPromises, ingredientPromise]);
}


/**
 * 
 * @param {IDBObjectStore} objStore 
 * @param {string} key 
 * @returns {Promise<{name:string, dlc: string, effects: number[], goldValue: number, weight: number}>}
 */
export function getByName(objStore, key) {
    return new Promise((resolve, reject) => {
        const request = objStore.get(key);
        request.onsuccess = () => {
            console.info('Ingredient found: ', request.result);
            resolve(request.result);
        };
        request.onerror = (e) => {
            e.preventDefault();
            console.info(e.target);
            console.error('Error result: ', request.error);
            reject(request.error);
        };
    });
}

/**
 * 
 * @param {IDBObjectStore} objStore 
 * @param {number} id 
 * @returns {Promise<Effect>}
 */
export function getByEffectId(objStore, id) {
    return new Promise((resolve, reject) => {
        const request = objStore.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            console.info('Effect of %d not found.', id);
            reject(request.result);
        }
    });
}

/**
 * 
 * @param {IDBObjectStore} objStore 
 * @param {any} value 
 * @returns {Promise<IDBValidKey>}
 */
export function addEntry(objStore, value) {
    return new Promise((resolve, reject) => {
        const request = objStore.add(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.result);
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
