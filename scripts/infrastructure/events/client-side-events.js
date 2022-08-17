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

/**
 * 
 * @param {EventTarget} target 
 * @param {string} ingredientName 
 * @returns {boolean}
 */
const triggerIngredientSelected = (target, ingredientName) => triggerEvent(INGREDIENT_SELECTED, target, {ingredientName}, {bubbles: true, cancelable: true});

/**
 * 
 * @param {EventTarget} target 
 * @param {string} ingredientName 
 * @returns {boolean}
 */
const triggerIngredientDeselected = (target, ingredientName) => triggerEvent(INGREDIENT_DESELECTED, target, {ingredientName}, {bubbles: true, cancelable: true});

/**
 * 
 * @param {EventTarget} target 
 * @returns {boolean}
 */
const triggerMaxSelected = target => triggerEvent(MAX_INGREDIENTS_SELECTED, target, null, {bubbles: true});

/**
 * 
 * @param {EventTarget} target 
 * @param {string} detail 
 * @returns {boolean}
 */
const triggerListCleared = (target, detail) => triggerEvent(LIST_CLEARED, target, detail, {bubbles: true, cancelable: true});



export {
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
    triggerCalculatePotionEvt,
    triggerMaxSelected,
    triggerIngredientDeselected,
    triggerListCleared,
    triggerIngredientSelected
};