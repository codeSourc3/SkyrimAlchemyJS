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
    #observer;
    /** @type {Map<string, HTMLElement>} */
    #namesToNodes = new Map();
    /**
     * 
     * @param {HTMLOListElement} olList 
     */
    constructor(olList, ingredientList = new IngredientList()) {
        this.#ingredientList = ingredientList;
        this.#olList = olList;
        /*
        Attach mutation observer to keep running map of ingredient names to child nodes. 
        */
        this.#observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const {addedNodes, removedNodes} = mutation;
                    if (removedNodes.length > 0) {
                        for (const node of removedNodes.values()) {
                            this.#namesToNodes.delete(node.textContent);
                        }
                    }
                    if (addedNodes.length > 0) {
                        for (const node of addedNodes.values()) {
                            this.#namesToNodes.set(node.textContent, node);
                        }
                    }
                    console.dir(this.#namesToNodes);
                }
            }
        });
        this.#observer.observe(this.#olList, {
            childList: true,
        });
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
     * @param {HTMLElement | string} element 
     */
    select(element) {
        let elementToChange = element;
        if (typeof element === 'string') {
            elementToChange = this.#namesToNodes.get(element);
        }
        elementToChange.dataset.selected = true;
        this.#ingredientList.selectIngredient(elementToChange.textContent);
    }

   

    /**
     * 
     * @param {HTMLElement | string} element 
     */
    deselect(element) {
        let elementToChange = element;
        if (typeof element === 'string') {
            elementToChange = this.#namesToNodes.get(element);
        }
        this.#ingredientList.unselectIngredient(elementToChange.textContent);
        console.debug('Removing selected from dataset.');
        let result = delete elementToChange.dataset.selected;
        console.assert(result, 'Dataset attribute \'selected\' was not removed.');
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