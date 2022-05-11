import { MAX_CHOSEN_INGREDIENTS } from "../../alchemy/alchemy.js";


/**
 * A list of ingredients. Remembers what the user selected even if cleared.
 */
class IngredientList {
    #currentSelectedIngredients
    /**
     * Creates an ingredient-list.
     * 
     * @param {Set<string>} aSet a Set to use instead
     * of creating a new one.
     */
    constructor(aSet = new Set()) {
        this.#currentSelectedIngredients = aSet;
    }

    static get MAX_INGREDIENTS() {
        return MAX_CHOSEN_INGREDIENTS;
    }

    get selectedIngredients() {
        return this.#currentSelectedIngredients;
    }

    

    selectIngredient(ingredientName) {
        this.#currentSelectedIngredients.add(ingredientName);
    }

    

    unselectIngredient(ingredientName) {
        let didSucceed = this.#currentSelectedIngredients.delete(ingredientName);
        return didSucceed;
    }

    hasIngredient(ingredientName) {
        return this.#currentSelectedIngredients.has(ingredientName);
    }

    clear() {
        this.#currentSelectedIngredients.clear();
    }
    

    

    canSelectMore() {
        return this.#currentSelectedIngredients.size < IngredientList.MAX_INGREDIENTS;
    }


    
}

export { IngredientList };