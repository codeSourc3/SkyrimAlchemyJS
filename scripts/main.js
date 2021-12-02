import {buildCalculateMessage, buildPopulateMessage, buildSearchMessage} from './infrastructure/messaging.js';
import {createList, createListItem, DomCache, removeAllChildren} from './infrastructure/html/html.js';
import { MAX_CHOSEN_INGREDIENTS, MIN_CHOSEN_INGREDIENTS } from './alchemy/alchemy.js';
import { createIngredientDeselected, createIngredientSelected, createMaxIngredientsSelected, INGREDIENT_DESELECTED, INGREDIENT_SELECTED, LIST_CLEARED, MAX_INGREDIENTS_SELECTED } from './infrastructure/events/client-side-events.js';
import { AlchemyWorker } from './infrastructure/worker/alchemy-worker.js';
import { IngredientList } from './infrastructure/html/ingredient-list.js';
import { ChosenIngredients } from './infrastructure/html/chosen-ingredients.js';

const alchemyWorker = new AlchemyWorker('scripts/infrastructure/worker/alchemy-worker-script.js');
const domCache = new DomCache();
alchemyWorker.onWorkerReady(onWorkerReady);
alchemyWorker.onIngredientSearchResult( onSearchResult);
alchemyWorker.onPopulateIngredientList(onPopulateResult);
alchemyWorker.onCalculateResult(onCalculateResult);
alchemyWorker.onWorkerError(onErrorMessage);
// setting up listener.
window.addEventListener('beforeunload', (e) => {
    console.log('Terminating Worker');
    alchemyWorker.terminate();
});

/**
 * The form responsible for calculating the potion resulting from
 * user input.
 * @type {HTMLFormElement}
 */
const brewPotionForm = domCache.id('brew-potion');
brewPotionForm.addEventListener('submit', handleBrewPotionFormSubmit);
/**
 * The form responsible for filtering the ingredients by
 * their DLC, effects, gold cost, etc.
 * @type {HTMLFormElement}
 */
const ingredientSearchBar = domCache.id('alchemy-searchbar');
ingredientSearchBar.addEventListener('submit', onSearchFormSubmit);
const brewingErrorOutput = domCache.id('brewing-error-message');
const ingredientListElem = domCache.id('ingredient-list');
const chosenIngredientsElem = domCache.id('chosen-ingredients');
const resultList = domCache.id('result-list');
const hitCount = domCache.id('hit-count');

// Used to avoid querying the DOM to get the name of the ingredient.
const currentSelectedIngredients = new Set();
const ingredientList = new IngredientList(ingredientListElem, currentSelectedIngredients);
const chosenIngredients = new ChosenIngredients(chosenIngredientsElem);
ingredientListElem.addEventListener(INGREDIENT_SELECTED, (evt) => {
    const ingredientName = evt.detail.ingredientName;
    console.log(`${ingredientName} selected`);
    chosenIngredients.addIngredient(ingredientName);
});

ingredientListElem.addEventListener(INGREDIENT_DESELECTED, (evt) => {
    const ingredientName = evt.detail.ingredientName;
    console.info(`${ingredientName} deselected`);
    chosenIngredients.removeIngredient(ingredientName);
});

chosenIngredientsElem.addEventListener(LIST_CLEARED, evt => {
    const elementsToKeep = evt.detail;
    console.info('Ingredients to keep in chosen: ', elementsToKeep, evt.target);
    chosenIngredients.addAll(elementsToKeep);
});
chosenIngredientsElem.addEventListener(INGREDIENT_DESELECTED, evt => {
    const ingredientName = evt.detail.ingredientName;
    ingredientList.unselectIngredient(ingredientName);
})

ingredientListElem.addEventListener(MAX_INGREDIENTS_SELECTED, displayTooManyIngredientsMessage);

function onErrorMessage({detail: {payload: message}}) {
    console.error(`Error: ${message}`);
}

/**
 * 
 * @param {CustomEvent<{payload: any}>} payload 
 */
function onCalculateResult({detail: {payload}}) {
    console.log('Worker calculation results: ', payload);
}

/**
 * 
 * @param {CustomEvent<{payload: string[]}>} payload 
 */
function onSearchResult({detail: {payload}}) {
    if (Array.isArray(payload)) {
        
        if (payload.length > 0) {
            // We have search results.
            ingredientList.addAll(payload);
            setHitCount(payload.length);
            // TODO: make ingredient list remember currently selected ingredients.
            chosenIngredients.clear();
        } else {
            // Query turned up nothing.
            ingredientList.replaceWithNoResults();
        }
        
    }
}

/**
 * Search for ingredients.
 * @param {SubmitEvent} event 
 */
function onSearchFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(ingredientSearchBar);
    let dlc = ['Vanilla'];
    let effectSearch = formData.get('search-effects');
    let effOrder = formData.get('effect-sort-order');
    if (formData.has('dragonborn-dlc')) dlc.push('Dragonborn');
    if (formData.has('dawnguard-dlc')) dlc.push('Dawnguard');
    if (formData.has('hearthfire-dlc')) dlc.push('Hearthfire');
    let searchMessage = buildSearchMessage(effectSearch, effOrder, dlc);
    alchemyWorker.postMessage(searchMessage);
}

/**
 * 
 * @param {CustomEvent<{payload: import('./infrastructure/db/db.js').IngredientEntry[]}>} payload 
 */
function onPopulateResult({detail: {payload}}) {
    console.assert(Array.isArray(payload), 'Populate results payload was not an array');
    let ingredientNames = payload.map(value => value.name);
    ingredientList.addAll(ingredientNames);
    setHitCount(payload.length);
    
}

function setHitCount(count) {
    hitCount.textContent = `Number of Results: ${count}`;
}


function displayTooManyIngredientsMessage() {
    console.warn('Too many ingredients, unselect some.');
}

/**
 * Posts a populate message to the worker.
 */
function onWorkerReady() {
    const message = buildPopulateMessage();
    alchemyWorker.postMessage(message);
}

/**
 * Handles the submission of the potion brewing form.
 * @param {SubmitEvent} event 
 */
function handleBrewPotionFormSubmit(event) {
    // Prevents the form from redirecting to a URL.
    event.preventDefault();
    let selectedIngredients = Array.from(currentSelectedIngredients);
    if (selectedIngredients.length < MIN_CHOSEN_INGREDIENTS) {
        brewPotionForm.reset();
        brewingErrorOutput.textContent = `Expected 2 to 3 ingredients to be selected.`;
        return;
    }
    const formData = new FormData(brewPotionForm);
    formData.set('selected-ingredients', Array.from(currentSelectedIngredients).join());
    for (const [key, value] of formData.entries()) {
        console.log(`Key: ${key}, Value: ${value}`);
    }
    const calculateMsg = toCalculateMessage(formData);
    alchemyWorker.postMessage(calculateMsg);
    // Assuming we still have the paragraph element.
    if (resultList.hasChildNodes) {
        console.log('Attempting to remove default text');
        removeAllChildren(resultList);
    }
}

/**
 * Constructs a calculate message from the form data
 * submitted.
 * @param {FormData} formData data from the potion brewing form.
 * @returns {import('./infrastructure/messaging.js').Message}
 */
function toCalculateMessage(formData) {
    let hasPhysician = formData.has('physician-perk');
    let hasBenefactor = formData.has('benefactor-perk');
    let hasPoisoner = formData.has('poisoner-perk');
    let selectedIngredients = String(formData.get('selected-ingredients')).split(',');
    console.assert(Array.isArray(selectedIngredients), `selectedIngredients are ${typeof selectedIngredients}`);
    let alchemist = Number(formData.get('alchemist-perk'));
    let skillLevel = Number(formData.get('skill-level'));
    let fortifyAlchemy = Number(formData.get('fortify-alchemy'));
    return buildCalculateMessage(selectedIngredients, skillLevel, alchemist, hasPhysician, hasBenefactor, hasPoisoner, fortifyAlchemy);
}
