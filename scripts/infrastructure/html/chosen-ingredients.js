import { createIngredientDeselected, createListCleared } from "../events/client-side-events.js";
import { createListItem } from "./html.js";

/**
 * 
 */
class ChosenIngredients {
    #list;
    #selected;

    /**
     * 
     * @param {HTMLUListElement} listElement 
     * @param {Set<string>} selectedSet 
     */
    constructor(listElement, selectedSet = new Set()) {
        this.#list = listElement;
        this.#selected = selectedSet;
        this.#list.addEventListener('click', this);
    }

    hasIngredient(ingredientName) {
        return this.#selected.has(ingredientName);
    }

    addIngredient(ingredientName) {
        //
        this.#selected.add(ingredientName);
        this.addToList(ingredientName);
    }

    removeIngredient(ingredientName) {
        let didRemove = this.#selected.delete(ingredientName);
        if (didRemove) {
            this.removeFromList(ingredientName);
        }
    }

    /**
     * 
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
     * 
     * @param {string[]} ingredientNames 
     */
    addAll(ingredientNames) {
        for (let ingredientName of ingredientNames) {
            this.addIngredient(ingredientName);
        }
    }

    clear(retainSelected=true) {
        while (this.#list.firstElementChild) {
            this.#list.removeChild(this.#list.firstElementChild);
        }
        let elementsToKeep = [];
        if (retainSelected) {
            console.debug('Retaining selected');
            const currentElements = Array.from(this.#selected.values());
            console.debug('Current elements', currentElements);
            elementsToKeep = elementsToKeep.concat(currentElements);
            console.debug('Elements to keep: ', elementsToKeep);
        } else {
            this.#selected.clear();
        }
        const clearEvt = createListCleared(elementsToKeep);
        this.#list.dispatchEvent(clearEvt);
    }

    /**
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
            const ingredientDeselected = createIngredientDeselected(textContent);
            this.#list.dispatchEvent(ingredientDeselected);
        }
    }
}

export {ChosenIngredients};