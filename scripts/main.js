/// <reference types="vite/client" />
import '../styles/styles.css';
import {DomCache, tag} from './infrastructure/html/html.js';
import { MIN_CHOSEN_INGREDIENTS } from './alchemy/alchemy.js';
import { INGREDIENT_DESELECTED, INGREDIENT_SELECTED, LIST_CLEARED, MAX_INGREDIENTS_SELECTED } from './infrastructure/events/client-side-events.js';
import { AlchemyWorker } from './infrastructure/worker/alchemy-worker.js';
import { IngredientList } from './infrastructure/models/ingredient-list.js';
import { ChosenIngredients } from './infrastructure/models/chosen-ingredients.js';

import { formatListLocalized } from './infrastructure/strings.js';
import { IngredientListView } from './infrastructure/views/ingredient-list-view.js';
import { isNullish } from './infrastructure/utils.js';

/**
 * @template T
 * @typedef {CustomEvent<{payload: T}} AlchemyWorkerEvent
 * 
 */

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
const ingredientListElem = domCache.id('ingredient-list');
const chosenIngredientsElem = domCache.id('chosen-ingredients');
const resultList = domCache.id('possible-potions');
const hitCount = domCache.id('hit-count');
const invalidElementsCache = [];


// Used to avoid querying the DOM to get the name of the ingredient.
const ingredientList = new IngredientList();
const ingredientListView = new IngredientListView(ingredientListElem, ingredientList);
const chosenIngredients = new ChosenIngredients(chosenIngredientsElem);
/**
 * @type {HTMLButtonElement}
 */
const brewPotionButton = brewPotionForm.elements[brewPotionForm.elements.length - 2];

// Add ARIA support for checkboxes
const SECOND_FIELDSET_INDEX = 3;
ingredientSearchBar.elements[SECOND_FIELDSET_INDEX].addEventListener('change', e => {
    e.target.ariaChecked = e.target.checked;
});

ingredientSearchBar.addEventListener('reset', evt => {
    // on Search form reset, remove all chosen ingredients. Remove all selected ingredients as well.
    ingredientListView.reset();
    chosenIngredients.clear();
    invalidElementsCache.length = 0;
    // Done because the submit handler runs before the form has a chance to reset.
    setTimeout(() => ingredientSearchBar.requestSubmit(), 0);
}, {passive: true});

// Resetting brew potion form
brewPotionForm.addEventListener('reset', e => {
    const defaultParagraph = tag('li', {children: [tag('p', {content: `Choose two to three ingredients.`})]});
    resultList.replaceChildren(defaultParagraph);
});


// Adds selected ingredient to chosen ingredients.
ingredientListElem.addEventListener(INGREDIENT_SELECTED, (evt) => {
    const ingredientName = evt.detail.ingredientName;
    /**
     * @type {HTMLLIElement}
     */
    let liElem = evt.target;
    console.assert(liElem instanceof HTMLInputElement, 'Exepected an input element.');
    if (brewPotionButton.validationMessage.length > 0) {
        brewPotionButton.setCustomValidity('');
    }
    ingredientListView.select(liElem);
    console.info(`${ingredientName} selected`);
    chosenIngredients.addIngredient(ingredientName);
});

// Removes unselected ingredient from chosen ingredients.
ingredientListElem.addEventListener(INGREDIENT_DESELECTED, (evt) => {
    const ingredientName = evt.detail.ingredientName;
    /**
     * @type {HTMLLIElement}
     */
    let liElem = evt.target;
    ingredientListView.deselect(liElem);
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
    console.debug(`chosen ingredient deselected evt listener: Ingredient ${ingredientName} deselected.`);
    ingredientList.unselectIngredient(ingredientName);
    ingredientListView.deselect(ingredientName);
});

ingredientListElem.addEventListener(MAX_INGREDIENTS_SELECTED, displayTooManyIngredientsMessage);


function onErrorMessage({detail: {payload: message}}) {
    console.error(`Error: ${message}`);
}

/**
 * 
 * @param {AlchemyWorkerEvent<import('./infrastructure/messaging.js').CalculateResultPayload>} payload 
 */
function onCalculateResult({detail: {payload}}) {
    console.info('Worker calculation results: ', payload);
    let nodes = [];
    if (payload.size > 0) {
        payload.forEach((item, combination) => {
            let node = displayPotion(item, combination);
            nodes.push(node);
        });
    } else {
        const noResults = displayPotion({name: 'Potion Failed', didSucceed: false});
        nodes.push(noResults);
    }
    
    resultList.replaceChildren(...nodes);
}

/**
 * Displays the given potion. Does not remove any children from the parent.
 * @param {{name:string, didSucceed:boolean, effects?:string, gold?:number}} param0 
 */
function displayPotion({name, didSucceed, effects, gold}, combination='') {
    const frag = document.createDocumentFragment();
    const li = tag('li');
    // create name paragraph.
    const potionName = tag('h2', {
        content: name
    });
    li.appendChild(potionName);
    if (didSucceed) {
        // add effects and gold to fragment.
        const potionEffects = tag('p', {
            content: `Description: ${effects}`
        });
        li.appendChild(potionEffects);
        
        const potionSellPrice = tag('p', {
            content: `Gold: ${gold}`
        });
        li.appendChild(potionSellPrice);

        const recipe = tag('i', {
            content: `Recipe: ${combination}`
        });
        li.appendChild(recipe);
    }
    frag.appendChild(li);
    return frag;
}

/**
 * 
 * @param {AlchemyWorkerEvent<import('./infrastructure/messaging.js').SearchResultPayload>} payload 
 */
function onSearchResult({detail: {payload}}) {
    console.debug('Search result incoming', payload);
    if (Array.isArray(payload.results)) {
        if (payload.results.length > 0) {
            // We have search results.
            ingredientListView.replaceChildrenWith(payload.results, payload.query);
            setHitCount(payload.results.length);
            
        } else {
            // Query turned up nothing.
            ingredientListView.replaceWithNoResults();
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
    dlc.push(...formData.getAll('installed-dlc'));
    console.debug('Ingredient search form submitting ', Array.from(formData.entries()));
    // Showing what the user last searched for.
    queryInterpretation.textContent = stringifyQuery(effectSearch, effOrder, dlc);
    ingredientListElem.ariaSort = effOrder === 'asc' ? 'ascending' : 'descending';
    alchemyWorker.sendSearchMessage(effectSearch, effOrder, dlc);
}

/**
 * 
 * @param {CustomEvent<{payload: import('./infrastructure/messaging.js').PopulateResultPayload}>} payload 
 */
function onPopulateResult({detail: {payload}}) {
    console.assert(Array.isArray(payload), 'Populate results payload was not an array');
    ingredientListView.replaceChildrenWith(payload);
    setHitCount(payload.length);
    
}

function setHitCount(count) {
    hitCount.textContent = `${count}`;
}

/**
 * 
 * @param {Event} event 
 */
function displayTooManyIngredientsMessage(event) {
    /**
     * @type {HTMLInputElement}
     */
    const excessInputElement = event.target;
    invalidElementsCache.push(excessInputElement);
    excessInputElement.setCustomValidity(`Too many ingredients were selected. Unselect some please.`);
    excessInputElement.reportValidity();
    setTimeout(() => {
        let el = invalidElementsCache.pop();
        if (!isNullish(el)) {
            el.setCustomValidity('');
        }
    }, 1000);
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
    /**
     * @type {HTMLButtonElement}
     */
    const submitter = event.submitter;
    let selectedIngredients = Array.from(ingredientList.selectedIngredients);
    if (selectedIngredients.length < MIN_CHOSEN_INGREDIENTS) {
        submitter.setCustomValidity('Expected 2 to 3 ingredients to be selected.');
        submitter.reportValidity();
        return;
    }
    const formData = new FormData(brewPotionForm);
    submitter.setCustomValidity('');
    sendCalculateMessage(formData);
    
    // Assuming we still have the paragraph element.
    if (resultList.hasChildNodes()) {
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
    let selectedIngredients = formData.getAll('selected-ingredients');
    console.assert(selectedIngredients.length > 0, `Selected ingredients can't be empty.`);
    let alchemist = Number(formData.get('alchemist-perk'));
    let skillLevel = Number(formData.get('skill-level'));
    let fortifyAlchemy = Number(formData.get('fortify-alchemy'));

    formData.forEach(([value, key]) => console.debug(`Debugging Send Calculate Message: ${key}, ${value}`));
    alchemyWorker.sendCalculateMessage(selectedIngredients, skillLevel, alchemist, hasPhysician, hasBenefactor, hasPoisoner, fortifyAlchemy);
}
