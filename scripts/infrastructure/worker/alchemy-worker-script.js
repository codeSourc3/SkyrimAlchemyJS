import { Ingredient, parseIngredientsJSON } from "../../alchemy/ingredients.js";
import { DB_NAME, VERSION, ING_OBJ_STORE } from "../config.js";
import { createPotionBuilder as makePotion, findPossibleCombinations } from "../../alchemy/alchemy.js";
import { openDB, insertEntry, filterIngredientsByEffect, getAllIngredientNames, filterByDLC, getIngredient, filterIngredientsBy } from '../db/db.js';
import {buildCalculateResultMessage, buildErrorMessage, buildPopulateResultMessage, buildSearchResultMessage, buildWorkerReadyMessage} from '../messaging.js';
import {isNullish, and} from '../utils.js';

/**
 * @type {IDBDatabase}
 */
let db;

/**
 * @type {MessagePort | undefined}
 */
let port2;

let shouldUpgrade = false;
globalThis.addEventListener('message', async e => {
    if (e.data.type === 'init') {
        console.info('initializing');
        port2 = e.ports[0];
        console.assert(!isNullish(port2), 'Port 2 did not transfer.');
    }
    await setupIndexedDB();
    port2.postMessage(buildWorkerReadyMessage(self.name));
    listenToEvents(port2);
}, {once: true});

/**
 * Adds event listeners to supporting the message types of calculate, search and populate.
 * The populate event listener has it's once flag set to true, so it will unregister itself automatically.
 * 
 * @param { MessagePort} source The message port to listen to.
 */
function listenToEvents(source) {
    source.addEventListener('message', async e => {
        if (e.data.type === 'calculate') {
            try {
                const results = await processIngredients(db, e.data.payload);
                source.postMessage(buildCalculateResultMessage(results));
            } catch (err) {
                source.postMessage(buildErrorMessage(err.message));
            }
        }
    });
    source.addEventListener('message', async e => {
        if (e.data.type === 'search') {
            const searchResults = await filterIngredients(db, e.data.payload);
            source.postMessage(buildSearchResultMessage(searchResults));
        }
    });
    source.addEventListener('message', async e => {
        if (e.data.type === 'populate') {
            const ingredients = await getAllIngredientNames(db);
            source.postMessage(buildPopulateResultMessage(ingredients));
        }
    }, {once: true});
    source.start();
}

/**
 * A clojure returning a predicate for use by the filterIngredientsBy function.
 * 
 * @param {string} effectName the name of the effect the ingredient should include.
 * @returns {import("../db/query.js").predicateCB}
 * 
 */
const byEffect = (effectName) => {
    return (value, key) => {
        return /** @type {import("../db/db.js").IngredientEntry} */(value).effectNames.includes(effectName);
    };
};

/**
 * A clojure returning a predicate for use by the filterIngredientsBy function.
 * 
 * @param {string[]} dlc the name of the dlc the ingredient should include.
 * @returns {import("../db/query.js").predicateCB}
 */
const byDLC = (dlc) => {
    return (value, key) => {
        return dlc.includes(/** @type {import("../db/db.js").IngredientEntry} */(value).dlc);
    };
};


/**
 * Filters ingredients by effect and dlc according to the message payload.
 * 
 * @param {IDBDatabase} db 
 * @param {import("../messaging.js").SearchMessagePayload} messagePayload 
 * @returns {import('../db/db.js').IngredientEntry[]}
 */
async function filterIngredients(db, messagePayload) {
    let {effectSearchTerm, effectOrder='asc', dlc=['Vanilla']} = messagePayload;
    console.groupCollapsed('Searching ingredients');
    if (!dlc.includes('Vanilla')) {
        dlc.push('Vanilla');
    }
    let searchResults = [];
    const appliedFilters = [];
    if (effectSearchTerm === 'All') {
        const allFilter = (value, key) => {
            return true;
        };
        appliedFilters.push(allFilter);
        console.info('Getting all ingredients');
    } else {
        const effectFilter = byEffect(effectSearchTerm);
        appliedFilters.push(effectFilter);
        console.info(`Getting by Effect ${effectSearchTerm}`);
    }
    appliedFilters.push(byDLC(dlc));
    const filterFunc = and(...appliedFilters);
    let unprocessedResults = await filterIngredientsBy(db, filterFunc);
    const comparator = createComparator(!sortingOrderToBool(effectOrder));
    searchResults = unprocessedResults.map(item => item.name).sort(comparator);
    console.debug('Filters: ', searchResults);
    
    console.groupEnd();
    return searchResults;
}

function createComparator(reversed) {
    return (a, b) => {
        return (a == b ? 0 : a < b ? -1 : 1) * (reversed ? -1 : 1);
    };
}

/**
 * 
 * @param {string} order 
 * @returns {boolean}
 */
function sortingOrderToBool(order) {
    return order === 'asc';
}

/**
 * Attempts to make a potion with the provided ingredients and character stats.
 * 
 * @param {IDBDatabase} db the database.
 * @param {{names: string[], skill: number, alchemist: number, hasBenefactor: boolean, hasPhysician: boolean, hasPoisoner: boolean, fortifyAlchemy: number}} nrIngredients 
 * @returns {Map<string, import("../../alchemy/alchemy.js").Potion>}
 */
async function processIngredients(db, { names, skill, alchemist, hasBenefactor, hasPhysician, hasPoisoner, fortifyAlchemy }) {
    const nrIngredients = names.length;
    const potionMaker = makePotion(skill, alchemist, hasPhysician, hasBenefactor, hasPoisoner, fortifyAlchemy);
    
    if (nrIngredients > 1) {
        const ingredients = await Promise.all(names.map(name => getIngredient(db, name)));
        let combinations = findPossibleCombinations(ingredients);
        /**
         * @type {Map<string, import("../../alchemy/alchemy.js").Potion>}
         */
        let results = new Map();
        console.debug('Possible combinations: ', combinations);
        for (let [key, effects] of combinations) {
            results.set(key, potionMaker(effects));
        }
        return results;
    } else {
        throw new Error('Need more than one ingredient.');
    }
}

/**
 * 
 * @param {Event} event 
 */
function dbCloseHandler(event) {
    console.log('Database closed');
}

/**
 * Builds an ingredient data store.
 * @param {IDBVersionChangeEvent} event 
 * 
 */
function buildStructure(event) {
    /**
     * @type {IDBDatabase}
     */
    const db = event.target.result;
    db.addEventListener('close', dbCloseHandler);
    
    shouldUpgrade = true;
    console.time('building structure');
    if (!db instanceof IDBDatabase) {
        console.error('Something went wrong with opening database.');
        self.close();
    }
    const ingObjectStore = db.createObjectStore(ING_OBJ_STORE, { keyPath: 'name' });
    ingObjectStore.createIndex('effect_names', 'effectNames', { multiEntry: true });
    ingObjectStore.createIndex('dlc', 'dlc');
    console.timeEnd('building structure');
    console.assert(ingObjectStore.transaction.mode === 'versionchange', 'Transaction is not a versionchange');
    
}

/**
 * 
 * @param {IDBDatabase} db the database
 * @param {any} data 
 */
async function populateDatabase(db, data) {
    console.time('populate db');
    const tx = db.transaction([ING_OBJ_STORE], 'readwrite');
    const ingObj = tx.objectStore(ING_OBJ_STORE);
    
    
    const ingredients = Object.values(data).map(value => new Ingredient(value));
    
    
    const ingredientEntries = ingredients.map(ingredient => insertEntry(ingObj, ingredient));
    try {
        await Promise.all(ingredientEntries);
    } catch (err) {
        console.error('Error populating database');
    }
    console.timeEnd('populate db');
}


/**
 * Loads data from JSON file and populates database.
 * 
 * @returns {Promise<void>}
 */
async function setupIndexedDB() {
    
    const ingredientData = await parseIngredientsJSON('../../../data/ingredients.json');
    try {
        db = await openDB(DB_NAME, buildStructure, VERSION);
        if (shouldUpgrade) {
            console.log('Populating database');
            await populateDatabase(db, ingredientData);
        }
    } catch (error) {
        console.log('Error setting up database: ', error);
    }



}


