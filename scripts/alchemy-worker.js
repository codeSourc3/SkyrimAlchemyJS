import { Ingredient, parseIngredientsJSON } from "./alchemy/ingredients.js";
import { DB_NAME, VERSION, ING_OBJ_STORE } from "./infrastructure/config.js";
import { makePotion } from "./alchemy/alchemy.js";
import { openDB, insertEntry, getIngredient, getAllIngredients } from './infrastructure/db.js';
import {buildCalculateResultMessage, buildErrorMessage, buildPopulateResultMessage, buildSearchResultMessage, buildWorkerReadyMessage} from './infrastructure/messaging.js';

/**
 * @type {IDBDatabase}
 */
let db;



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
    console.log('From main thread: ', { msgData });
    const end = self.performance.now();
    console.debug('Time taken is %d', end - start);
    switch (msgData.type) {
        case 'calculate':
            await processIngredients(db, msgData.payload);
            break;
        case 'search': 
            postMessage(buildSearchResultMessage('Search not implemented yet'));
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
 * Processes the ingredients.
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
 * Builds an ingredient data store.
 * @param {IDBVersionChangeEvent} event 
 * @param {any} data
 */
function buildStructure(event) {
    /**
     * @type {IDBDatabase}
     */
    const db = event.target.result;
    if (!db instanceof IDBDatabase) {
        console.error('Something went wrong with opening database.');
        self.close();
    }
    const ingObjectStore = db.createObjectStore(ING_OBJ_STORE, { keyPath: 'name' });
    ingObjectStore.createIndex('effect_names', 'effectNames', { multiEntry: true });
    
    
}

/**
 * 
 * @param {IDBDatabase} db 
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



async function setupIndexedDB() {
    const ingredientData = await parseIngredientsJSON();
    try {
        db = await openDB(DB_NAME, buildStructure, VERSION);
        await populateDatabase(db, ingredientData);
    } catch (error) {
        console.log('Error setting up database: ', error);
    }



}


