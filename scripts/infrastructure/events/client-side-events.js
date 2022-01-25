

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
 * Dispatches an event using the target. If the detail is null it fires a normal Event,
 * else it dispatches a CustomEvent.
 * 
 * @param {string} eventName the name of the event.
 * @param {EventTarget} target the event target to dispatch the event.
 * @param {object} detail the data to transmit.
 * @param {CustomEventInit | EventInit} options the options of the event. 
 * @returns {boolean}
 */
function triggerEvent(eventName, target, detail=null, options={bubbles: false, cancelable: false, composed: false}) {
    
    let eventObject;
    if (detail !== null) {
        eventObject = new CustomEvent(eventName, {...options, detail});
    } else {
        eventObject = new Event(eventName, options);
    }
    let wasCanceled = target.dispatchEvent(eventObject);
    return wasCanceled;
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

/**
 * 
 * @param {EventTarget} target 
 * @returns {boolean}
 */
const triggerWorkerReady = (target) => triggerEvent(WORKER_READY, target, null, {bubbles: true});

/**
 * 
 * @param {EventTarget} target 
 * @param {string[]} detail 
 * @returns {boolean}
 */
const triggerPopulate = (target, detail) => triggerEvent(POPULATE_INGREDIENT_LIST, target, {payload: detail}, {bubbles: true});


/**
 * 
 * @param {EventTarget} target 
 * @param {import("../db/db").IngredientEntry[]} detail 
 * @returns {boolean}
 */
const triggerSearchEvt = (target, detail) => triggerEvent(INGREDIENT_SEARCH_RESULT, target, {payload: detail}, {bubbles: true, cancelable: true});

/**
 * 
 * @param {EventTarget} target 
 * @param {import("../../alchemy/alchemy").Potion} detail 
 * @returns {boolean}
 */
const triggerCalculatePotionEvt = (target, detail) => triggerEvent(CALCULATE_POTION_RESULT, target, {payload: detail}, {bubbles: true, cancelable: true});

/**
 * 
 * @param {EventTarget} target 
 * @param {string} detail - The error message.
 * @returns {boolean}
 */
const triggerWorkerError = (target, detail) => triggerEvent(WORKER_ERROR, target, {payload: detail}, {bubbles: true, cancelable: true});

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
 * 
 * @param {string} ingredientName the name of the ingredient.
 * @returns {CustomEvent<{ingredientName: string}>}
 */
function createIngredientSelected(ingredientName) {
    return ingredientSelectedFactory({ingredientName});
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
    createListCleared,
    dispatchEventAsync,
    MAX_INGREDIENTS_SELECTED,
    INGREDIENT_DESELECTED,
    INGREDIENT_SELECTED,
    WORKER_READY,
    POPULATE_INGREDIENT_LIST,
    INGREDIENT_SEARCH_RESULT,
    CALCULATE_POTION_RESULT,
    WORKER_ERROR,
    LIST_CLEARED,
    triggerEvent,
    triggerWorkerReady,
    triggerWorkerError,
    triggerSearchEvt,
    triggerPopulate,
    triggerCalculatePotionEvt
};