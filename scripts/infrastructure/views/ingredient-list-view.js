import {IngredientList} from '../models/ingredient-list.js';
import {tag, createListItem} from '../html/html.js';
import {triggerIngredientSelected, triggerIngredientDeselected, triggerMaxSelected, triggerListCleared} from '../events/client-side-events.js';

/**
 * 
 * @param {Set<string>} aSet 
 * @param {HTMLOListElement} olList 
 */
 function saveAndFireListCleared(aSet, olList) {
    const currentElements = Array.from(aSet.values());
    triggerListCleared(olList, currentElements);
}

export class IngredientListView {
    #olList;
    #ingredientList;
    /**
     * 
     * @param {HTMLOListElement} olList 
     */
    constructor(olList, ingredientList = new IngredientList()) {
        this.#ingredientList = ingredientList;
        this.#olList = olList;
        this.#olList.addEventListener('click', this);
    }

    replaceWithNoResults() {
        const domFrag = document.createDocumentFragment();
        const noResultsP = tag('p', { content: `No results.` });
        domFrag.appendChild(noResultsP);
        this.#olList.replaceChildren(domFrag);
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    select(element) {
        element.dataset.selected = true;
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    deselect(element) {
        if ('selected' in element.dataset) {
            delete element.dataset.selected;
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
            if (this.#ingredientList.hasIngredient(element)) {
                this.select(listEl);
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#ingredientList.selectedIngredients, this.#olList);
        this.#olList.appendChild(frag);
    }

    replaceChildrenWith(elements = []) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createListItem(element);
            // highlight selected elements.
            if (this.#ingredientList.hasIngredient(element)) {
                this.select(listEl);
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#ingredientList.selectedIngredients, this.#olList);
        this.#olList.replaceChildren(frag);
    }

    reset() {
        this.#ingredientList.clear();
    }

    /**
     * 
     * @param {PointerEvent} evt 
     */
    handleEvent(evt) {
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
         if (!this.#ingredientList.hasIngredient(textContent) && this.#ingredientList.canSelectMore()) {
             this.#ingredientList.selectIngredient(textContent);
             triggerIngredientSelected(selectedElement, textContent);
         } else if (this.#ingredientList.hasIngredient(textContent)) {
             this.#ingredientList.unselectIngredient(textContent);
             triggerIngredientDeselected(selectedElement, textContent);
         } else {
             triggerMaxSelected(selectedElement);
         }
    }
}