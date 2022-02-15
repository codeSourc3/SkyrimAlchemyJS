import {DomCache, tag} from './infrastructure/html/html.js';
import { MIN_CHOSEN_INGREDIENTS } from './alchemy/alchemy.js';
import { INGREDIENT_DESELECTED, INGREDIENT_SELECTED, LIST_CLEARED, MAX_INGREDIENTS_SELECTED } from './infrastructure/events/client-side-events.js';
import { AlchemyWorker } from './infrastructure/worker/alchemy-worker.js';
import { IngredientList } from './infrastructure/html/ingredient-list.js';
import { ChosenIngredients } from './infrastructure/html/chosen-ingredients.js';

import { formatListLocalized } from './infrastructure/strings.js';

const alchemyWorker = new AlchemyWorker('scripts/infrastructure/worker/alchemy-worker-script.js');
const domCache = new DomCache();
alchemyWorker.onWorkerReady(onWorkerReady);
alchemyWorker.onIngredientSearchResult( onSearchResult);
alchemyWorker.onPopulateIngredientList(onPopulateResult);
alchemyWorker.onCalculateResult(onCalculateResult);
alchemyWorker.onWorkerError(onErrorMessage);
// setting up listener.
window.addEventListener('beforeunload', (e) => {
    console.info('Terminating Worker');
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
const ingredientSearchBar = domCache.id('ingredient-filter');
ingredientSearchBar.addEventListener('submit', onSearchFormSubmit);
const queryInterpretation = domCache.id('query-interpretation');
const brewingErrorOutput = domCache.id('brewing-error-message');
const ingredientListElem = domCache.id('ingredient-list');
const chosenIngredientsElem = domCache.id('chosen-ingredients');
const resultList = domCache.id('possible-potions');
const hitCount = domCache.id('hit-count');



// Used to avoid querying the DOM to get the name of the ingredient.
const currentSelectedIngredients = new Set();
const ingredientList = new IngredientList(ingredientListElem, currentSelectedIngredients);
const chosenIngredients = new ChosenIngredients(chosenIngredientsElem);

ingredientSearchBar.addEventListener('reset', evt => {
    // on Search form reset, remove all chosen ingredients. Remove all selected ingredients as well.
    ingredientList.selectedIngredients.clear();
    chosenIngredients.clear();
    console.debug('Submitting search.');
    // Done because the submit handler runs before the form has a chance to reset.
    setTimeout(() => ingredientSearchBar.requestSubmit(), 0);
}, {passive: true});

// Adds selected ingredient to chosen ingredients.
ingredientListElem.addEventListener(INGREDIENT_SELECTED, (evt) => {
    const ingredientName = evt.detail.ingredientName;
    console.info(`${ingredientName} selected`);
    chosenIngredients.addIngredient(ingredientName);
});

// Removes unselected ingredient from chosen ingredients.
ingredientListElem.addEventListener(INGREDIENT_DESELECTED, (evt) => {
    const ingredientName = evt.detail.ingredientName;
    console.info(`${ingredientName} deselected`);
    chosenIngredients.removeIngredient(ingredientName);
});

// 
chosenIngredientsElem.addEventListener(LIST_CLEARED, evt => {
    const elementsToKeep = evt.detail;
    console.info('Ingredients to keep in chosen: ', elementsToKeep, evt.target);
    chosenIngredients.addAll(elementsToKeep);
});

// Unselects ingredient from ingredient list if chosen ingredients is clicked on.
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
 * @param {CustomEvent<{payload: Map<string, import('./alchemy/alchemy.js').Potion> }>} payload 
 */
function onCalculateResult({detail: {payload}}) {
    console.info('Worker calculation results: ', payload);
    let nodes = [];
    payload.forEach((item, combination) => {
        let node = displayPotion(item, combination);
        nodes.push(node);
    });
    resultList.replaceChildren(...nodes);
}

/**
 * Displays the given potion. Does not remove any children from the parent.
 * @param {{name:string, didSucceed:boolean, effects?:string, gold?:number}} param0 
 */
function displayPotion({name, didSucceed, effects, gold}, combination='') {
    const frag = document.createDocumentFragment();
    // create name paragraph.
    const potionName = tag('h2', {
        content: name
    });
    frag.appendChild(potionName);
    if (didSucceed) {
        // add effects and gold to fragment.
        const potionEffects = tag('p', {
            content: `Description: ${effects}`
        });
        frag.appendChild(potionEffects);
        
        const potionSellPrice = tag('p', {
            content: `Gold: ${gold}`
        });
        frag.appendChild(potionSellPrice);

        const recipe = tag('i', {
            content: `Recipe: ${combination}`
        });
        frag.appendChild(recipe);
    }
    return frag;
}

/**
 * 
 * @param {CustomEvent<{payload: string[]}>} payload 
 */
function onSearchResult({detail: {payload}}) {
    console.debug('Search result incoming', payload);
    if (Array.isArray(payload)) {
        
        if (payload.length > 0) {
            // We have search results.
            ingredientList.replaceChildrenWith(payload);
            setHitCount(payload.length);
            
        } else {
            // Query turned up nothing.
            ingredientList.replaceWithNoResults();
        }
        
    }
}

/**
 * 
 * @param {string} effectToSearch 
 * @param {"asc" | "desc"} effectOrder 
 * @param {string[]} dlc 
 * @returns {string}
 */
function stringifyQuery(effectToSearch, effectOrder, dlc) {
    return `Showing ingredients sharing "${effectToSearch}", sorted by ${effectOrder}, and part of ${formatListLocalized(dlc)}`;
}

/**
 * Search for ingredients.
 * @param {SubmitEvent} event 
 */
function onSearchFormSubmit(event) {
    event.preventDefault();
    console.assert(event.defaultPrevented);
    console.debug('Ingredient Search submitted.');
    const formData = new FormData(ingredientSearchBar);
    let dlc = ['Vanilla'];
    let effectSearch = formData.get('by-effect');
    let effOrder = formData.get('effect-sort-order');
    if (formData.has('dragonborn-dlc')) dlc.push('Dragonborn');
    if (formData.has('dawnguard-dlc')) dlc.push('Dawnguard');
    if (formData.has('hearthfire-dlc')) dlc.push('Hearthfire');
    console.debug('Ingredient search form submitting ', Array.from(formData.entries()));
    // Showing what the user last searched for.
    queryInterpretation.textContent = stringifyQuery(effectSearch, effOrder, dlc);
    alchemyWorker.sendSearchMessage(effectSearch, effOrder, dlc);
}

/**
 * 
 * @param {CustomEvent<{payload: string[]}>} payload 
 */
function onPopulateResult({detail: {payload}}) {
    console.assert(Array.isArray(payload), 'Populate results payload was not an array');
    ingredientList.addAll(payload);
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
    alchemyWorker.sendPopulateMessage();
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
        console.debug(`Key: ${key}, Value: ${value}`);
    }
    sendCalculateMessage(formData);
    
    // Assuming we still have the paragraph element.
    if (resultList.hasChildNodes) {
        console.debug('Attempting to remove default text');
        resultList.replaceChildren();
    }
}

/**
 * Constructs a calculate message from the form data
 * submitted.
 * @param {FormData} formData data from the potion brewing form.
 * @returns {import('./infrastructure/messaging.js').Message}
 */
function sendCalculateMessage(formData) {
    let hasPhysician = formData.has('physician-perk');
    let hasBenefactor = formData.has('benefactor-perk');
    let hasPoisoner = formData.has('poisoner-perk');
    let selectedIngredients = String(formData.get('selected-ingredients')).split(',');
    console.assert(Array.isArray(selectedIngredients), `selectedIngredients are ${typeof selectedIngredients}`);
    let alchemist = Number(formData.get('alchemist-perk'));
    let skillLevel = Number(formData.get('skill-level'));
    let fortifyAlchemy = Number(formData.get('fortify-alchemy'));
    alchemyWorker.sendCalculateMessage(selectedIngredients, skillLevel, alchemist, hasPhysician, hasBenefactor, hasPoisoner, fortifyAlchemy);
}
