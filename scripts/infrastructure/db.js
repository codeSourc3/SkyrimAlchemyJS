import { Effect, Ingredient } from "../alchemy/ingredients.js";
import { ING_OBJ_STORE, EFFECT_OBJ_STORE } from "./config.js";

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
 * @returns {Promise<Ingredient>}
 */
export function getIngredient(db, name) {
    const tx = db.transaction([ING_OBJ_STORE, EFFECT_OBJ_STORE]);
    const ingObj = tx.objectStore(ING_OBJ_STORE);
    const effObj = tx.objectStore(EFFECT_OBJ_STORE);
    const getRequest = ingObj.get(name);
    const getIngredientPromise = new Promise(resolve => {
        getRequest.onsuccess = () => resolve(getRequest.result);
    });
    
    return getIngredientPromise.then(ingredient => {
        return getEffectsFromIngredient(ingredient, effObj);
    }).then(([ingredient, ...effects]) => {
        // Ingredient should be found on index 0.
        // Effects should be found on indices 1, 2, 3, 4.
        ingredient.effects = effects;
        console.debug('Effects: ', effects);
        console.debug('Ingredient: ', ingredient);
        return Promise.resolve(new Ingredient(ingredient));
    });
    
}

/**
 * 
 * @param {IDBDatabase} db 
 * @returns {Promise<any>}
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
 * 
 * @param {{name:string, dlc: string, effects: number[], goldValue: number, weight: number}} ingredient 
 * @param {IDBObjectStore} effObj 
 * @returns {Promise<[{name: string, dlc: string, effects:number, goldValue: number, weight:number}, Effect, Effect, Effect, Effect]>}
 */
function getEffectsFromIngredient(ingredient, effObj) {
    let effectPromises = ingredient.effects.map(id => {
        return new Promise(resolve => {
            const getEffect = effObj.get(id);
            getEffect.onsuccess = () => resolve(getEffect.result);
        });
    });
    const ingredientPromise = Promise.resolve(ingredient);
    return Promise.all([ingredientPromise, ...effectPromises]);
}


/**
 * Gets the ingredient by name. Case-sensitive.
 * @param {IDBObjectStore} objStore the object store to get by key.
 * @param {string} key a case-sensitive string.
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
 * Gets the Effect by its ID.
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
