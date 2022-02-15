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
        const noResultsP = tag('p', {content: `No results.`});
        domFrag.appendChild(noResultsP);
        this.#olList.replaceChildren(domFrag);
    }

    unselectIngredient(ingredientName) {
        let didSucceed = this.#currentSelectedIngredients.delete(ingredientName);
        if (didSucceed) {
            const len = this.#olList.children.length;
            for (let i = 0; i < len; i++) {
                const child = this.#olList.children[i];
                if (child.textContent === ingredientName) {
                    child.classList.remove('selected-ingredient');
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
                listEl.classList.add('selected-ingredient');
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#currentSelectedIngredients, this.#olList);
        this.#olList.appendChild(frag);
    }

    replaceChildrenWith(elements=[]) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createListItem(element);
            // highlight selected elements.
            if (this.#currentSelectedIngredients.has(element)) {
                listEl.classList.add('selected-ingredient');
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#currentSelectedIngredients, this.#olList);
        this.#olList.replaceChildren(frag);
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
         const {textContent} = selectedElement;
         const li = selectedElement.closest('li');
         // no li element.
         if (!li) return;
         // li not in UL element.
         if (!this.#olList.contains(li)) return;
         if (!this.#currentSelectedIngredients.has(textContent) && this.#currentSelectedIngredients.size < IngredientList.MAX_INGREDIENTS) {
             /*
             Doesn't have ingredient and can at least select
             one more.
             */
            this.#currentSelectedIngredients.add(textContent);
            triggerIngredientSelected(selectedElement, textContent);
            selectedElement.classList.toggle('selected-ingredient');
         } else if (this.#currentSelectedIngredients.has(textContent)) {
             // Was previously selected and can be deselected.
             this.#currentSelectedIngredients.delete(textContent);
             selectedElement.classList.toggle('selected-ingredient');

             // create and dispatch ingredient-deselected.
             triggerIngredientDeselected(selectedElement, textContent);
         } else {
             // Cannot select more ingredients.
             triggerMaxSelected(selectedElement);
         }
    }
}

export {IngredientList};