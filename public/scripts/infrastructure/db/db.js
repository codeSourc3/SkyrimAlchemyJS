import { Effect, Ingredient } from "../../alchemy/ingredients.js";
import { ING_OBJ_STORE } from "../config.js";
import {equals, equalsAnyOf, filterBy, startsWith} from './query.js'
import { defaultIDBRequestHandler } from "./handlers.js";
/**
 * @typedef IngredientEntry
 * @property {string} dlc the downloadable content the ingredient belongs to.
 * @property {Effect[]} effects an array of IDs for the effects.
 * @property {string[]} effectNames an array of names of effects for use by IndexedDB indexes.
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
    const request = globalThis.indexedDB.open(dbName, version);
    request.onupgradeneeded = upgradeHandler;
    /** @type {Promise<IDBDatabase>} */
    const openDBPromise = defaultIDBRequestHandler(request);
    return openDBPromise;
}

/**
 * 
 * @param {IDBValidKey} key 
 * @param {*} value the value of the cursor.
 * @returns {boolean} always returns true for the default predicate.
 */
const defaultPredicate = (key, value) => {
    return true;
};


/**
 * Opens and closes a transaction to get an ingredient.
 * @param {IDBDatabase} db 
 * @param {string} name
 * @returns {Promise<Ingredient>}
 */
export function getIngredient(db, name) {
    const tx = db.transaction([ING_OBJ_STORE]);
    const ingObj = tx.objectStore(ING_OBJ_STORE);
    const getRequest = ingObj.get(name);
    const getIngredientPromise = new Promise(resolve => {
        getRequest.onsuccess = () => resolve(new Ingredient(getRequest.result));
    });
    
    return getIngredientPromise;
    
}

/**
 * 
 * @param {IDBDatabase} db 
 * @param {string[]} dlc 
 * @returns {Promise<string[]>}
 */
export function filterByDLC(db, dlc=['Vanilla'], asc=true) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([ING_OBJ_STORE]);
        const objectStore = transaction.objectStore(ING_OBJ_STORE);
        const index = objectStore.index('dlc');
        let results = [];
        const direction = asc ? 'next' : 'prev';
        equalsAnyOf(index, dlc, direction, item => {
            results.push(item);
        }, err => {
            if (err) {
                reject(err);
            } else {
                console.info('Filter by DLC: ', results);
                resolve(results);
            }
        })
    });
}

/**
 * Tries to filter ingredients by name
 * @param {IDBDatabase} db the database
 * @param {string} searchText the search text.
 * @returns {Promise<string[]>}
 */
export function filterIngredientsByName(db, searchText, asc=true) {
    return new Promise((resolve, reject) => {
        console.debug('Filtering ingredients by name');

        const transaction = db.transaction([ING_OBJ_STORE], 'readonly');
        const objectStore = transaction.objectStore(ING_OBJ_STORE);
        let results = [];
        startsWith(objectStore, searchText, asc ? 'next': 'prev', (item, key) => {
            results.push(item.name);
            console.info(`${searchText} matched ${key}`);
        }, (err) => {
            if (err) {
                console.debug('Error name: ', err.name);
                reject(err);
            } else {
                resolve(results);
            }
        });
        
    });
}


/**
 * 
 * @param {IDBDatabase} db 
 * @param {(key: IDBValidKey, value: any) => boolean} predicate 
 * @param {boolean} asc 
 * @returns {Promise<IngredientEntry[]>}
 */
export function filterIngredientsBy(db, predicate=defaultPredicate, asc=true) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(ING_OBJ_STORE, 'readonly');
        const objStore = transaction.objectStore(ING_OBJ_STORE);
        let results = [];
        filterBy(objStore, null, asc ? 'next': 'prev', predicate, (item) => {
            results.push(item);
        }, (err) => {
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
 * @param {IDBDatabase} db 
 * @param {string} searchText 
 * @param {boolean} asc 
 * @returns {Promise<string[]>}
 */
export function filterIngredientsByEffect(db, searchText, asc=true) {
    return new Promise((resolve, reject) => {
        console.debug('Filtering ingredients by effect.');

        const transaction = db.transaction(ING_OBJ_STORE, 'readonly');
        const objectStore = transaction.objectStore(ING_OBJ_STORE);
        const index = objectStore.index('effect_names');
        let results = [];
        equals(index, searchText, asc ? 'next': 'prev', (item) => {
            results.push(item.name);
        }, err => {
            if (err) {
                console.debug('Error name: ', err.name);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


/**
 * 
 * @param {IDBDatabase} db 
 * @returns {Promise<IngredientEntry[]>}
 */
export function getAllIngredients(db) {
    const tx = db.transaction(ING_OBJ_STORE, 'readonly');
    const ingredientStore = tx.objectStore(ING_OBJ_STORE);
    const getIngredients = ingredientStore.getAll();
    const getIngredientsPromise = defaultIDBRequestHandler(getIngredients);

    return getIngredientsPromise;
}

/**
 * 
 * @param {IDBDatabase} db 
 * @returns {Promise<string[]>}
 */
export function getAllIngredientNames(db) {
    const tx = db.transaction(ING_OBJ_STORE);
    const ingredientStore = tx.objectStore(ING_OBJ_STORE);
    /** @type {IDBRequest<IngredientEntry[]>} */
    const getIngredients = ingredientStore.getAll(); 
    /**
     * @type {Promise<string[]>}
     */   
    const getIngredientsPromise = new Promise(resolve => {
        getIngredients.onsuccess = () => resolve(getIngredients.result.map(entry => entry.name));
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
    const request = objStore.add(value);
    const promise = defaultIDBRequestHandler(request);
    return promise;
}




/**
 * 
 * @param {IDBObjectStore} objStore 
 * @param {any} value 
 * @returns {Promise<IDBValidKey>}
 */
export function insertEntry(objStore, value) {
    const request = objStore.put(value);
    const promise = defaultIDBRequestHandler(request);
    return promise;
}


/**
 * 
 * @param {IDBObjectStore} objStore the object store.
 * @param {IDBValidKey | IDBKeyRange} key the key or key range.
 * 
 * @returns {Promise<number>}
 */
export function getCount(objStore, key) {
    const request = objStore.count(key);
    const promise = defaultIDBRequestHandler(request);
    return promise;
}

