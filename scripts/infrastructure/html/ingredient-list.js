import { MAX_CHOSEN_INGREDIENTS } from "../../alchemy/alchemy.js";
import { triggerIngredientDeselected, triggerIngredientSelected, triggerListCleared, triggerMaxSelected } from "../events/client-side-events.js";
import { createListItem, tag } from "./html.js";

/**
 * 
 * @param {Set<string>} aSet 
 * @param {HTMLOListElement} olList 
 */
function saveAndFireListCleared(aSet, olList) {
    const currentElements = Array.from(aSet.values());
    triggerListCleared(olList, currentElements);
}

/**
 * 
 * @param {HTMLLIElement} li 
 */
function select(li) {
    li.dataset.selected = true;
}

/**
 * @param {HTMLLIElement} li 
 */
function unselect(li) {
    delete li.dataset.selected;
}

/**
 * A list of ingredients. Remembers what the user selected even if cleared.
 */
class IngredientList {
    #currentSelectedIngredients
    #olList
    /**
     * Creates an ingredient-list.
     * 
     * @param {HTMLOListElement} listElement 
     * @param {Set<string>} aSet a Set to use instead
     * of creating a new one.
     */
    constructor(listElement, aSet = new Set()) {
        this.#olList = listElement;
        this.#currentSelectedIngredients = aSet;
        this.#olList.addEventListener('click', this);
    }

    static get MAX_INGREDIENTS() {
        return MAX_CHOSEN_INGREDIENTS;
    }

    get selectedIngredients() {
        return this.#currentSelectedIngredients;
    }

    /**
     * Removes the HTML list but not the selected ingredients.
     */
    clearList() {
        this.#olList.replaceChildren();
        saveAndFireListCleared(this.#currentSelectedIngredients, this.#olList)
    }

    /**
     * Removes both the selected ingredients and the HTML list.
     */
    reset() {
        this.#olList.replaceChildren();
        this.#currentSelectedIngredients.clear();
        saveAndFireListCleared(this.#currentSelectedIngredients, this.#olList);
    }

    replaceWithNoResults() {
        const domFrag = document.createDocumentFragment();
        const noResultsP = tag('p', { content: `No results.` });
        domFrag.appendChild(noResultsP);
        this.#olList.replaceChildren(domFrag);
    }

    unselectIngredient(ingredientName) {
        let didSucceed = this.#currentSelectedIngredients.delete(ingredientName);
        if (didSucceed) {
            const len = this.#olList.children.length;
            for (let i = 0; i < len; i++) {
                /**
                 * @type {HTMLElement}
                 */
                const child = this.#olList.children[i];
                if (child.textContent === ingredientName) {
                    unselect(child);
                    break;
                }
            }
        }
    }

    /**
     * 
     * @param {string[]} elements 
     */
    addAll(elements) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createListItem(element);
            // highlight selected elements.
            if (this.#currentSelectedIngredients.has(element)) {
                select(listEl);
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#currentSelectedIngredients, this.#olList);
        this.#olList.appendChild(frag);
    }

    replaceChildrenWith(elements = []) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createListItem(element);
            // highlight selected elements.
            if (this.#currentSelectedIngredients.has(element)) {
                select(listEl);
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#currentSelectedIngredients, this.#olList);
        this.#olList.replaceChildren(frag);
    }

    canSelectMore() {
        return this.#currentSelectedIngredients.size < IngredientList.MAX_INGREDIENTS;
    }


    /**
     * Using handleEvent property.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventListener
     * @param {PointerEvent} evt 
     */
    handleEvent(evt) {
        // if event is any pointer event.
        /**
             * @type {HTMLElement}
             */
        const selectedElement = evt.target;
        const { textContent } = selectedElement;
        const li = selectedElement.closest('li');
        // no li element.
        if (!li) return;
        // li not in UL element.
        if (!this.#olList.contains(li)) return;
        if (!this.#currentSelectedIngredients.has(textContent) && this.canSelectMore()) {
            this.#currentSelectedIngredients.add(textContent);
            triggerIngredientSelected(selectedElement, textContent);
        } else if (this.#currentSelectedIngredients.has(textContent)) {
            this.#currentSelectedIngredients.delete(textContent);
            triggerIngredientDeselected(selectedElement, textContent);
        } else {
            triggerMaxSelected(selectedElement);
        }
    }
}

export { IngredientList };