import { parseIngredientsJSON } from "./alchemy/ingredients.js";
import { makePotion } from "./alchemy/alchemy.js";
import { openDB, getObjectStore, getByName, addEntry } from './infrastructure/db.js';

console.info('hi')
const DB_NAME = 'alchemy';
const VERSION = 1;
const ING_OBJ_STORE = 'ingredients';
const EFFECT_OBJ_STORE = 'effects';
setupIndexedDB().then(() => {
    self.addEventListener('message', handleMessage);
}).catch(e => console.info(e));


/**
 * 
 * @param {MessageEvent} msg the message from the main thread.
 */
 async function handleMessage(msg) {
    const msgData = msg.data;
    console.log('From main thread: ', { msgData });
    const db = await openDB(DB_NAME, buildStructure, VERSION);
    const ingObjStore = getObjectStore(db, ING_OBJ_STORE, 'readonly');
    const effectIndex = ingObjStore.index('effects');
    let effectCount = effectIndex.count();
    effectCount.onsuccess = () => console.log('Does effects work: ',effectCount.result);
    console.log('Does effects work: ', effectCount);
    await processIngredients(ingObjStore, msgData);

}

/**
 * Processes the ingredients.
 * @param {IDBObjectStore} ingObjectStore 
 * @param {number} nrIngredients 
 */
 async function processIngredients(ingObjectStore, { names, skill, alchemist, hasBenefactor, hasPhysician, hasPoisoner, fortifyAlchemy }) {
    const nrIngredients = names.length;
    const potionMaker = makePotion(skill, alchemist, hasPhysician, hasBenefactor, hasPoisoner, fortifyAlchemy);
    if (nrIngredients === 2) {
        const first = await getByName(ingObjectStore, names[0]);
        const second = await getByName(ingObjectStore, names[1]);
        const results = first.mixTwo(second);
        const potion = potionMaker(results);
        postMessage(potion);
    } else if (nrIngredients === 3) {
        const first = await getByName(ingObjectStore, names[0]);
        const second = await getByName(ingObjectStore, names[1]);
        const third = await getByName(ingObjectStore, names[2]);
        const results = first.mixThree(second, third);
        const potion = potionMaker(results);
        postMessage(potion);
    } else {
        postMessage({ error: 'Needs more than one ingredient' });
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
    ingObjectStore.createIndex('effects', 'effects', { multiEntry: true });
    
    
    
}

/**
 * 
 * @param {IDBDatabase} db 
 * @param {any} data 
 */
async function populateDatabase(db, data) {
    const tx = db.transaction([ING_OBJ_STORE], 'readwrite');
    const ingObj = tx.objectStore(ING_OBJ_STORE);
    
    Object.values(data).forEach(value => {
        
        
        ingObj.add(value);
        
    });
}

/**
 * 
 * @param {IDBDatabase} db 
 * @param {any} data 
 */
function populateEffects(db, data) {
    
}


async function setupIndexedDB() {
    const ingredientData = await parseIngredientsJSON();
    try {
        const db = await openDB(DB_NAME, e => {
            buildStructure(e);
            const db = e.target.result;
            populateDatabase(db, ingredientData);
        }, VERSION);
    
    } catch (error) {
        console.log(error);
    }
    
    

}


