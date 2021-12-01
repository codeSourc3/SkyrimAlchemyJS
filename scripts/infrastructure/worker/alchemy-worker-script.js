import { Ingredient, parseIngredientsJSON } from "../../alchemy/ingredients.js";
import { DB_NAME, VERSION, ING_OBJ_STORE } from "../config.js";
import { makePotion } from "../../alchemy/alchemy.js";
import { openDB, insertEntry, getAllIngredients, filterIngredientsByEffect, getAllIngredientNames, filterByDLC, getIngredient } from '../db/db.js';
import {buildCalculateResultMessage, buildErrorMessage, buildPopulateResultMessage, buildSearchResultMessage, buildWorkerReadyMessage} from '../messaging.js';
import { logger } from "../logger.js";
import { difference, differenceArray, intersection, toArray, toSet } from "../array-helpers.js";
import { isInRange } from "../math.js";

/**
 * @type {IDBDatabase}
 */
let db;

let shouldUpgrade = false;

setupIndexedDB().then(() => {
    postMessage(buildWorkerReadyMessage(self.name));
    self.addEventListener('message', handleMessage);
    console.debug('Alchemy worker event listener set up.');
    console.assert(typeof db !== 'undefined');
});


/**
 * 
 * @param {MessageEvent} msg the message from the main thread.
 */
async function handleMessage(msg) {
    const start = self.performance.now();
    const msgData = msg.data;
    logger.log('From main thread to worker thread: ', { msgData });
    const end = self.performance.now();
    logger.debug('Time taken is %d', end - start);
    switch (msgData.type) {
        case 'calculate':
            await processIngredients(db, msgData.payload);
            break;
        case 'search': 
            const searchResults = await searchIngredients(db, msgData.payload);
            postMessage(buildSearchResultMessage(searchResults));
            break;
        case 'populate':
            const ingredients = await getAllIngredients(db);
            postMessage(buildPopulateResultMessage(ingredients));
            break;
        default:
            postMessage(buildErrorMessage('Message type not recognized!'));
    }
}

/**
 * Attempts to search for any ingredients by effect or ingredient names.
 * 
 * @param {IDBDatabase} db 
 * @param {import("../messaging.js").SearchMessagePayload} messagePayload 
 * @returns {import('../db/db.js').IngredientEntry[]}
 */
async function searchIngredients(db, messagePayload) {
    let {effectSearchTerm, effectOrder='asc', dlc=['Vanilla']} = messagePayload;
    console.groupCollapsed('Searching ingredients');
    if (!dlc.includes('Vanilla')) {
        dlc.push('Vanilla');
    }
    let searchResults = [];
    const appliedFilters = [];
    if (effectSearchTerm.length === 0) {
        appliedFilters.push(getAllIngredientNames(db));
        console.info('Getting all ingredients');
    } else {
        const byEffect = filterIngredientsByEffect(db, effectSearchTerm, sortingOrderToBool(effectOrder));
        appliedFilters.push(byEffect);
        console.info('Getting by Effect');
    }
    const byDLC = filterByDLC(db, dlc);
    appliedFilters.push(byDLC);
    let unprocessedResults = await Promise.all(appliedFilters);
    const comparator = createComparator(!sortingOrderToBool(effectOrder));
    searchResults = toArray(intersection(toSet(unprocessedResults[0]), toSet(unprocessedResults[1]))).sort(comparator);
    console.log('Filters: ', searchResults);
    
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
 */
async function processIngredients(db, { names, skill, alchemist, hasBenefactor, hasPhysician, hasPoisoner, fortifyAlchemy }) {
    const nrIngredients = names.length;
    const potionMaker = makePotion(skill, alchemist, hasPhysician, hasBenefactor, hasPoisoner, fortifyAlchemy);
    const [firstName, secondName, thirdName] = names;
    if (nrIngredients > 1) {
        const first = await getIngredient(db, firstName);
        const second = await getIngredient(db, secondName);
        let results = [];
        if (thirdName) {
            const third = await getIngredient(db, thirdName);
            results = first.mixThree(second, third);
        } else {
            results = first.mixTwo(second);
        }
        const potion = potionMaker(results);
        postMessage(buildCalculateResultMessage(potion));
    } else {
        postMessage(buildErrorMessage('Needs more than one ingredient'));
    }
}

/**
 * 
 * @param {Event} event 
 */
function dbCloseHandler(event) {
    
}

/**
 * Builds an ingredient data store.
 * @param {IDBVersionChangeEvent} event 
 * @param {any} data
 */
function buildStructure(event) {
    /**
     * @type {IDBDatabase}
     */
    const db = event.target.result;
    db.addEventListener('close', dbCloseHandler)
    
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
        await populateDatabase(db, ingredientData);
    } catch (error) {
        console.log('Error setting up database: ', error);
    }



}


