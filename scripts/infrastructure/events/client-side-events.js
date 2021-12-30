

/**
 * 
 * @param {string} type 
 * @param {{bubbles: boolean, cancelable: boolean, composed: boolean}} param1 
 * @returns {(data: T) => CustomEvent<T>}
 */
function createCustomEventFactory(type, {bubbles=false, cancelable= false, composed = false}) {
    return (data) => {
        return new CustomEvent(type, {bubbles, cancelable, composed, detail: data});
    };
}

/**
 * 
 * @param {string} type 
 * @param {{bubbles: boolean, cancelable: false, composed: false}} param1 
 * @returns {() => Event}
 */
function createEventFactory(type, {bubbles = false, cancelable = false, composed = false}={}) {
    return () => {
        return new Event(type, {bubbles, cancelable, composed});
    }
}

/**
 * 
 * @param {EventTarget} target 
 * @param {Event} event 
 */
function dispatchEventAsync(target, event) {
    setTimeout(() => {
        target.dispatchEvent(event);
    }, 0);
}


const WORKER_READY = 'worker-ready';
const POPULATE_INGREDIENT_LIST = 'populate-ingredient-list';
const INGREDIENT_SEARCH_RESULT = 'ingredient-search-result';
const CALCULATE_POTION_RESULT = 'calculate-potion-result';
const WORKER_ERROR = 'worker-error';
const workerReadyFactory = createEventFactory(WORKER_READY, {bubbles: true});
const populateIngredientListFactory = createCustomEventFactory(POPULATE_INGREDIENT_LIST, {bubbles: true});
const ingredientSearchFactory = createCustomEventFactory(INGREDIENT_SEARCH_RESULT, {bubbles: true, cancelable: true});
const calculatePotionFactory = createCustomEventFactory(CALCULATE_POTION_RESULT, {bubbles: true, cancelable: true});
const workerErrorFactory = createCustomEventFactory(WORKER_ERROR, {bubbles: true, cancelable: true});

// Event factories for choosing ingredients
const LIST_CLEARED = 'list-cleared';
const INGREDIENT_SELECTED = 'ingredient-selected';
const INGREDIENT_DESELECTED = 'ingredient-deselected';
const MAX_INGREDIENTS_SELECTED = 'max-ingredients-selected';
const ingredientSelectedFactory = createCustomEventFactory(INGREDIENT_SELECTED, {bubbles: true, cancelable: true});
const ingredientDeselectedFactory = createCustomEventFactory(INGREDIENT_DESELECTED, {bubbles: true, cancelable: true});
const maxIngredientsSelectedFactory = createEventFactory(MAX_INGREDIENTS_SELECTED, {bubbles: true});
const listClearedFactory = createCustomEventFactory(LIST_CLEARED, {bubbles: true, cancelable: true});
/**
 * Creates an event of type "ingredient-selected".
 * @param {string} ingredientName the name of the ingredient.
 * @returns {CustomEvent<{ingredientName: string}>}
 */
function createIngredientSelected(ingredientName) {
    return ingredientSelectedFactory({ingredientName});
}

function createWorkerReady() {
    return workerReadyFactory();
}

function createPopulateIngredientList(payload) {
    return populateIngredientListFactory({payload: payload});
}

function createIngredientSearchResult(payload) {
    return ingredientSearchFactory({payload});
}

function createCalculatePotionResult(payload) {
    return calculatePotionFactory({payload});
}

function createWorkerError(payload) {
    return workerErrorFactory({payload});
}

/**
 * 
 * @param {string} ingredientName 
 * @returns {CustomEvent<{ingredientName: string}>}
 */
function createIngredientDeselected(ingredientName) {
    return ingredientDeselectedFactory({ingredientName});
}

/**
 * 
 * @returns {Event}
 */
function createMaxIngredientsSelected() {
    return maxIngredientsSelectedFactory();
}

function createListCleared(elementsToKeep) {
    return listClearedFactory(elementsToKeep);
}

export {
    createIngredientSelected, 
    createIngredientDeselected, 
    createMaxIngredientsSelected,
    createWorkerReady,
    createPopulateIngredientList,
    createIngredientSearchResult,
    createCalculatePotionResult,
    createListCleared,
    createWorkerError,
    dispatchEventAsync,
    MAX_INGREDIENTS_SELECTED,
    INGREDIENT_DESELECTED,
    INGREDIENT_SELECTED,
    WORKER_READY,
    POPULATE_INGREDIENT_LIST,
    INGREDIENT_SEARCH_RESULT,
    CALCULATE_POTION_RESULT,
    WORKER_ERROR,
    LIST_CLEARED
};