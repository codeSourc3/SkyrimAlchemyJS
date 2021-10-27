import {buildPopulateMessage, buildSearchMessage} from './infrastructure/messaging.js';
import {createList, createListItem, DomCache, removeAllChildren} from './infrastructure/html.js';
import { MAX_CHOSEN_INGREDIENTS, MIN_CHOSEN_INGREDIENTS } from './alchemy/alchemy.js';
import { Ingredient } from './alchemy/ingredients.js';

const alchemyWorker = new Worker('scripts/alchemy-worker.js', {type: 'module', name: 'mixer'});
const domCache = new DomCache();
alchemyWorker.onmessage = handleWorkerMessage;
//alchemyWorker.onmessageerror = handleWorkerMessageError;
alchemyWorker.onerror = handleWorkerError;

// setting up listener.
window.addEventListener('beforeunload', (e) => {
    console.log('Terminating Worker');
    alchemyWorker.terminate();
});

/**
 * @type {HTMLFormElement}
 */
const brewPotionForm = domCache.id('brew-potion');
brewPotionForm.addEventListener('submit', handleBrewPotionFormSubmit);
/**
 * @type {HTMLFormElement}
 */
const ingredientSearchBar = domCache.id('alchemy-searchbar');
ingredientSearchBar.addEventListener('submit', onSearchFormSubmit);
const brewingErrorOutput = domCache.id('brewing-error-message');
const ingredientList = domCache.id('ingredient-list');
const chosenIngredients = domCache.id('chosen-ingredients');
const resultList = domCache.id('result-list');
// Used to avoid querying the DOM to get the name of the ingredient.
const currentSelectedIngredients = new Set();
/**
 * Handles the routing for the different messages sent by the worker.
 * @param {MessageEvent} messageEvent sent by the worker.
 */
function handleWorkerMessage(messageEvent) {
    const {type, payload} = messageEvent.data;
    
    switch (type) {
        case 'worker-ready':
            onWorkerReady();
            break;
        case 'search-result':
            onSearchResult(payload);
            break;
        case 'populate-result':
            onPopulateResult(payload);
            break;
        case 'calculate-result':
            onCalculateResult(payload);
            break;
        case 'error':
            onErrorMessage(payload);
            break;
        default:
            onUnknownMessage(type);
            break;
    }

    
}

function onUnknownMessage(type) {
    console.error(`${type} is not a valid message type.`);
}

function onErrorMessage(message) {
    console.error(`Error: ${message}`);
}

function onCalculateResult(payload) {
    console.log('Worker calculation results: ', payload);
}

/**
 * 
 * @param {import('./infrastructure/db.js').IngredientEntry[]} payload 
 */
function onSearchResult(payload) {
    console.log(payload);
    if (Array.isArray(payload)) {
        const domFrag = document.createDocumentFragment();
        payload.forEach(ingredient => {
            console.info('Filtered ingredient: ', ingredient);
            let listItem = createListItem(createListItemFromIngredient(ingredient));
            domFrag.appendChild(listItem);
        });
        removeAllChildren(ingredientList);
        ingredientList.appendChild(domFrag);
    }
}

/**
 * Search for ingredients.
 * @param {SubmitEvent} event 
 */
function onSearchFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(ingredientSearchBar);
    const logFormData = (searchFormData) => {
        console.group('Search form');
        for (const [key, value] of searchFormData.entries()) {
            console.log(`Key: "${key}", Value: "${value}"`);
        }
        console.groupEnd();
    };
    logFormData(formData);
    let searchMessage = buildSearchMessage(formData.get('search-ingredients'));
    alchemyWorker.postMessage(searchMessage);
}

/**
 * 
 * @param {import('./infrastructure/db.js').IngredientEntry[]} payload 
 */
function onPopulateResult(payload) {
    console.assert(Array.isArray(payload), 'Populate results payload was not an array');
    let ingredientNames = payload.map(createListItemFromIngredient);
    const ingredientListItems = createList(ingredientNames);
    ingredientList.append(ingredientListItems);
    ingredientList.addEventListener('click', toggleSelectedIngredient);
}


/**
 * Toggles the selected ingredient selected or unselected.
 * @param {PointerEvent} event the event.
 */
function toggleSelectedIngredient(event) {
    // Should toggle the ingredient as selected or unselected.
    // Can't have less than 2 ingredients or more than 3.
    /**
     * @type {HTMLElement}
     */
    const selectedElement = event.target;
    const {textContent} = selectedElement;
    if (selectedElement.tagName === 'LI') {
        if (!currentSelectedIngredients.has(textContent) && currentSelectedIngredients.size < MAX_CHOSEN_INGREDIENTS) {
            // doesn't have ingredient and can select one more.
            currentSelectedIngredients.add(textContent);
            addToChosenIngredients(textContent);
            selectedElement.classList.toggle('selected-ingredient');
        } else if (currentSelectedIngredients.has(textContent)) {
            currentSelectedIngredients.delete(textContent);
            selectedElement.classList.toggle('selected-ingredient');
            removeFromChosenIngredients(textContent);
        } else {
            displayTooManyIngredientsMessage();
        }
    }
    
}

function addToChosenIngredients(ingredientName) {
    const listItem = createListItem(ingredientName);
    chosenIngredients.append(listItem);
}

function removeFromChosenIngredients(ingredientName) {
    const chosenIngredientArray = Array.from(chosenIngredients.children);
    let foundNode = chosenIngredientArray.find(el => el.textContent === ingredientName);
    if (typeof foundNode === 'undefined') {
        throw new Error(`Ingredient name ${ingredientName} not found among chosen ingredients.`);
    }
    foundNode.remove();
}

function displayTooManyIngredientsMessage() {
    console.warn('Too many ingredients, unselect some.');
}

/**
 * Creates a list item from an ingredient entry.
 * @param {import('./infrastructure/db.js').IngredientEntry} ingredientEntry 
 * @returns {string} the name of the ingredient.
 */
function createListItemFromIngredient(ingredientEntry) {
    return ingredientEntry.name;
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
    if (selectedIngredients.length < 2) {
        brewPotionForm.reset();
        brewingErrorOutput.textContent = `Expected 2 to 3 ingredients to be selected.`;
        return;
    }
    const formData = new FormData(brewPotionForm);
    formData.set('selected-ingredients', Array.from(currentSelectedIngredients).join());
    for (const [key, value] of formData.entries()) {
        console.log(`Key: ${key}, Value: ${value}`);
    }
    // Assuming we still have the paragraph element.
    if (resultList.hasChildNodes) {
        console.log('Attempting to remove default text');
        resultList.children[0].remove();
    }
}

/**
 * 
 * @param {ErrorEvent} messageEvent 
 */
function handleWorkerError(messageEvent) {
    console.info('Default prevented: ', messageEvent.defaultPrevented);
    console.info('Source: ', messageEvent.target);
    console.info('Cancelable: ', messageEvent.cancelable);
    console.log('Event type: ', messageEvent.type);
    console.info('Message from main thread error handler: ', messageEvent.message);
    console.info('Line Nr: ', messageEvent.lineno);
    console.info('Return Value: ', messageEvent.returnValue);
    console.info('Error: ', messageEvent.error)
}

