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
 * 
 * @param {IDBDatabase} db 
 * @returns {Promise<Ingredient>}
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
