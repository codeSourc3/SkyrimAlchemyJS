import { Ingredient } from "../alchemy/ingredients.js";

function supportsIndexedDB() {
    return 'indexedDB' in globalThis;
}

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
 * @param {IDBObjectStore} objStore 
 * @param {string} key 
 * @returns {Promise<Ingredient>}
 */
export function getByName(objStore, key) {
    return new Promise((resolve, reject) => {
        const request = objStore.get(key);
        request.onsuccess = () => resolve(new Ingredient(request.result));
        request.onerror = () => reject(request.result);
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
