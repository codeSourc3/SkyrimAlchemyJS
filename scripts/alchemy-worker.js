import { Effect, Ingredient, parseIngredientsJSON } from "./alchemy/ingredients.js";
import { DB_NAME, VERSION, ING_OBJ_STORE, EFFECT_OBJ_STORE } from "./infrastructure/config.js";
import { makePotion } from "./alchemy/alchemy.js";
import { openDB, getObjectStore, getByName, insertEntry, getIngredient } from './infrastructure/db.js';
/**
 * @type {IDBDatabase}
 */
let db;



setupIndexedDB().then(() => {
    postMessage({event: 'worker-ready'});
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
    await processIngredients(db, msgData);
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
    if (nrIngredients === 2) {
        const first = await getIngredient(db, names[0]);
        const second = await getIngredient(db, names[1]);
        const results = first.mixTwo(second);
        const potion = potionMaker(results);
        postMessage(potion);
    } else if (nrIngredients === 3) {
        const first = await getIngredient(db, names[0]);
        const second = await getIngredient(db, names[1]);
        const third = await getIngredient(db, names[2]);
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
    // Creating effects object store.
    const effectObjectStore = db.createObjectStore(EFFECT_OBJ_STORE, { keyPath: 'id' });
    effectObjectStore.createIndex('name', 'name', { unique: false });
    
}

/**
 * 
 * @param {IDBDatabase} db 
 * @param {any} data 
 */
async function populateDatabase(db, data) {
    const tx = db.transaction([ING_OBJ_STORE, EFFECT_OBJ_STORE], 'readwrite');
    const ingObj = tx.objectStore(ING_OBJ_STORE);
    const effectObj = tx.objectStore(EFFECT_OBJ_STORE);
    
    const ingredients = Object.values(data).map(value => new Ingredient(value));
    const effects = ingredients.flatMap(ingredient => ingredient.effects);
    const effectLength = effects.length;
    for (let i = 0; i < effectLength; i+=4) {
        effects[i].id = i + 1;
        effects[i + 1].id = i + 2;
        effects[i + 2].id = i + 3;
        effects[i + 3].id = i + 4;
        const ingredient = ingredients[i / 4];
        ingredient.effects[0] = effects[i].id;
        ingredient.effects[1] = effects[i + 1].id;
        ingredient.effects[2] = effects[i + 2].id;
        ingredient.effects[3] = effects[i + 3].id;
    }
    const effectEntries = effects.map(effect => insertEntry(effectObj, effect));
    await Promise.all(effectEntries);
    const ingredientEntries = ingredients.map(ingredient => insertEntry(ingObj, ingredient));
    await Promise.all(ingredientEntries);
    
}



async function setupIndexedDB() {
    const ingredientData = await parseIngredientsJSON();
    try {
        db = await openDB(DB_NAME, buildStructure, VERSION);
        
        await populateDatabase(db, ingredientData);

    } catch (error) {
        console.log(error);
    }



}


