import { triggerIngredientDeselected, triggerListCleared } from "../events/client-side-events.js";
import { createListItem } from "../html/html.js";

/**
 * The ingredients the user has chosen. 
 */
class ChosenIngredients {
    #list;
    #chosen;

    /**
     * Attaches itself as an event listener for "click" events upon
     * being created.
     * 
     * @param {HTMLUListElement} listElement - The HTML list element to attach to.
     * @param {Set<string>} selectedSet - The Set to store chosen values on. Creates a new Set by default.
     */
    constructor(listElement, selectedSet = new Set()) {
        this.#list = listElement;
        this.#chosen = selectedSet;
        this.#list.addEventListener('click', this);
    }

    /**
     * Checks if ingredientName has been selected.
     * @param {string} ingredientName the name of the ingredient.
     * @returns {boolean} True if ingredient is chosen.
     */
    hasIngredient(ingredientName) {
        return this.#chosen.has(ingredientName);
    }

    /**
     * Adds the ingredient to chosen ingredients and adds to HTML list.
     * - Does nothing if the ingredientName is already present.
     * 
     * @param {string} ingredientName - The case-sensitive name of the ingredient.
     */
    addIngredient(ingredientName) {
        // Check that ingredientName is a string.
        if (typeof ingredientName !== 'string') {
            throw new TypeError(`ingredientName must be a string, not ${typeof ingredientName}`);
        }

        // check that ingredient hasn't been added already and isn't empty.
        if (this.#chosen.has(ingredientName) && ingredientName.length === 0) return;

        // Adds to chosen ingredients and adds to HTML list.
        this.#chosen.add(ingredientName);
        this.addToList(ingredientName);
    }

    /**
     * Attempts to remove the ingredient name from the chosen ingredients.
     * - If the ingredientName was actually removed then remove from the HTML list.
     * 
     * @param {string} ingredientName The case-sensitive name of the ingredient to remove.
     */
    removeIngredient(ingredientName) {
        let didRemove = this.#chosen.delete(ingredientName);
        if (didRemove) {
            this.removeFromList(ingredientName);
        }
    }

    /**
     * Adds the ingredient to the list element.
     * @private
     * @param {string} ingredientName 
     */
    addToList(ingredientName) {
        const listEl = createListItem(ingredientName);
        this.#list.appendChild(listEl);
    }

    /**
     * Searches for and removes a child from
     * the ingredient list by ingredient name.
     * @private
     * @param {string} ingredientName 
     */
    removeFromList(ingredientName) {
        const len = this.#list.children.length;
        for (let i = 0; i < len; i++) {
            const child = this.#list.children[i];
            if (child.textContent === ingredientName) {
                this.#list.removeChild(child);
                break;
            }
        }
    }

    /**
     * Adds all of the ingredients to the HTML list and chosen ingredients.
     * @param {string[]} ingredientNames 
     */
    addAll(ingredientNames) {
        for (let ingredientName of ingredientNames) {
            this.addIngredient(ingredientName);
        }
    }

    /**
     * 
     *
     */
    clear() {
        this.#list.replaceChildren();
        this.#chosen.clear();
        
        triggerListCleared(this.#list, []);
    }

    /**
     * Handles clicks on the HTML list and fires "ingredient-deselected".
     * 
     * @param {PointerEvent} evt 
     */
    handleEvent(evt) {
        // if list element is clicked on
        // remove from list and fire 
        // ingredient-deselected event.
        /**
         * @type {HTMLElement}
         */
        const selectedElement = evt.target;
        const li = selectedElement.closest('li');
        const {textContent} = selectedElement;
        if (!li) return;
        if (!this.#list.contains(li)) return;
        if (this.hasIngredient(textContent)) {
            // remove from selected and remove from list.
            this.removeIngredient(textContent);
            triggerIngredientDeselected(this.#list, textContent);
        }
    }
}

export {ChosenIngredients};