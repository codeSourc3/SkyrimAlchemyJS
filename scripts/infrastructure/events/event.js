
function createEventFactory(type, {bubbles=false, cancelable= false, composed = false}) {
    return (data) => {
        return new CustomEvent(type, {bubbles, cancelable, composed, detail: data});
    };
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

const INGREDIENT_SELECTED = 'ingredient-selected';
const INGREDIENT_DESELECTED = 'ingredient-deselected';
const MAX_INGREDIENTS_SELECTED = 'max-ingredients-selected';
const WORKER_READY = 'worker-ready';
const POPULATE_INGREDIENT_LIST = 'populate-ingredient-list';
const INGREDIENT_SEARCH_RESULT = 'ingredient-search';
const CALCULATE_POTION_RESULT = 'calculate-potion';
const workerReadyFactory = createEventFactory(WORKER_READY, {bubbles: true});
const populateIngredientListFactory = createEventFactory(POPULATE_INGREDIENT_LIST, {bubbles: true});
const ingredientSearchFactory = createEventFactory(INGREDIENT_SEARCH_RESULT, {bubbles: true, cancelable: true});
const calculatePotionFactory = createEventFactory(CALCULATE_POTION_RESULT, {bubbles: true, cancelable: true});
const ingredientSelectedFactory = createEventFactory(INGREDIENT_SELECTED, {bubbles: true});
const ingredientDeselectedFactory = createEventFactory(INGREDIENT_DESELECTED, {bubbles: true});
const maxIngredientsSelectedFactory = createEventFactory(MAX_INGREDIENTS_SELECTED, {bubbles: true});
/**
 * Creates an event of type "ingredient-selected".
 * @param {string} ingredientName the name of the ingredient.
 * @returns {CustomEvent<{ingredientName: string}>}
 */
function createIngredientSelected(ingredientName) {
    return ingredientSelectedFactory({ingredientName});
}

function createWorkerReady()

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
 * @returns {CustomEvent<any>}
 */
function createMaxIngredientsSelected() {
    return maxIngredientsSelectedFactory(null);
}

export {
    createIngredientSelected, 
    createIngredientDeselected, 
    createMaxIngredientsSelected,
    dispatchEventAsync,
    MAX_INGREDIENTS_SELECTED,
    INGREDIENT_DESELECTED,
    INGREDIENT_SELECTED
};