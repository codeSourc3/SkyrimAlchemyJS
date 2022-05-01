import { IngredientList } from '../models/ingredient-list.js';
import { tag, createListItem } from '../html/html.js';
import { triggerIngredientSelected, triggerIngredientDeselected, triggerMaxSelected, triggerListCleared } from '../events/client-side-events.js';

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
 * @param {string} ingredientName 
 * @returns {HTMLLIElement}
 */
function createSelectableListItem(ingredientName) {
    const listEl = document.createElement('li');

    const checkBoxInput = document.createElement('input');
    checkBoxInput.type = 'checkbox';
    checkBoxInput.name = 'selected-ingredients';
    checkBoxInput.id = ingredientName.replace(' ', '-').toLowerCase();
    checkBoxInput.value = ingredientName;

    const label = document.createElement('label');
    label.htmlFor = checkBoxInput.id;
    label.textContent = ingredientName;

    listEl.appendChild(checkBoxInput);
    listEl.appendChild(label);
    return listEl;
}

/**
 * This has to be done after the inputs have been added to the DOM because 
 * {@link Element.setAttribute} requires the element to be connected to the
 * document.
 * 
 * @param {HTMLInputElement[]} inputElements 
 * @param {string} formId 
 */
function linkInputsToForm(inputElements, formId) {
    if (Array.from(inputElements).every(input => input.isConnected)) {
        for (const inputEl of Array.from(inputElements)) {
            inputEl.setAttribute('form', formId);
        }
    } else {
        console.warn('Not all input elements are connected');
    }
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
                    const { addedNodes, removedNodes } = mutation;
                    if (removedNodes.length > 0) {
                        for (const node of removedNodes.values()) {
                            if (node.hasChildNodes()) {
                                const inputValue = node.childNodes[0].value;
                                this.#namesToNodes.delete(inputValue);
                            }
                        }
                    }
                    if (addedNodes.length > 0) {
                        for (const node of addedNodes.values()) {
                            const inputEl = node.childNodes[0];
                            const inputValue = inputEl.value;
                            console.debug('Added input node value: ', inputEl.value);
                            this.#namesToNodes.set(inputValue, inputEl);
                        }
                    }
                    console.dir(this.#namesToNodes);
                }
            }
        });
        this.#observer.observe(this.#olList, {
            childList: true,
        });
        this.#olList.addEventListener('change', this);
    }

    replaceWithNoResults() {
        const domFrag = document.createDocumentFragment();
        const noResultsP = tag('p', { content: `No results.` });
        domFrag.appendChild(noResultsP);
        this.#olList.replaceChildren(domFrag);
    }

    /**
     * 
     * @param {HTMLInputElement | string} element 
     */
    select(element) {
        let elementToChange = element;
        if (typeof element === 'string') {
            elementToChange = this.#namesToNodes.get(element);
        }
        elementToChange.checked = true;
        this.#ingredientList.selectIngredient(elementToChange.value);
    }



    /**
     * 
     * @param {HTMLInputElement | string} element 
     */
    deselect(element) {
        let elementToChange = element;
        if (typeof element === 'string') {
            elementToChange = this.#namesToNodes.get(element);
        }
        this.#ingredientList.unselectIngredient(elementToChange.value);
        console.debug('Removing selected from dataset.');
        elementToChange.checked = false;
    }

    /**
     * 
     * @param {string[]} elements 
     */
    addAll(elements) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createSelectableListItem(element);
            // highlight selected elements.
            if (this.#ingredientList.hasIngredient(element)) {
                this.select(listEl);
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#ingredientList.selectedIngredients, this.#olList);
        this.#olList.appendChild(frag);
        linkInputsToForm(this.#olList.querySelectorAll('input'), 'brew-potion');
    }

    /**
     * 
     * @param {string[]} elements 
     */
    replaceChildrenWith(elements = []) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createSelectableListItem(element);
            // highlight selected elements.
            if (this.#ingredientList.hasIngredient(element)) {
                this.select(listEl);
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#ingredientList.selectedIngredients, this.#olList);
        this.#olList.replaceChildren(frag);
        linkInputsToForm(this.#olList.querySelectorAll('input'), 'brew-potion');
    }

    reset() {
        this.#ingredientList.clear();
    }

    /**
     * Listens to change events.
     * @param {InputEvent} evt 
     */
    handleEvent(evt) {
        /**
             * @type {HTMLInputElement}
             */
        const selectedElement = evt.target;
        const { value } = selectedElement;
        
        if (!this.#ingredientList.hasIngredient(value) && this.#ingredientList.canSelectMore()) {
            this.#ingredientList.selectIngredient(value);
            triggerIngredientSelected(selectedElement, value);
        } else if (this.#ingredientList.hasIngredient(value)) {
            this.#ingredientList.unselectIngredient(value);
            triggerIngredientDeselected(selectedElement, value);
        } else {
            selectedElement.checked = false;
            triggerMaxSelected(selectedElement);
        }
    }
}