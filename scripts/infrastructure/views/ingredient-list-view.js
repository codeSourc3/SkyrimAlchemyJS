import { IngredientList } from '../models/ingredient-list.js';
import { tag, createListItem } from '../html/html.js';
import { triggerIngredientSelected, triggerIngredientDeselected, triggerMaxSelected, triggerListCleared } from '../events/client-side-events.js';
import { isNullish } from '../utils.js';

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
 * @param {string} ingredientName the name of the ingredient. May have spaces and apostrophes.
 * @returns {string}
 */
function valueToId(ingredientName) {
    let selectorId = ingredientName.split(' ').join('-');
    while (selectorId.includes('\'')) {
        selectorId = selectorId.replace('\'', '');
    }
    return selectorId;
}

/**
 * 
 * @param {import('../db/db.js').IngredientEntry} ingredientName 
 * @returns {HTMLLIElement}
 */
function createSelectableListItem(ingredient) {
    const listEl = document.createElement('li');
    listEl.ariaSelected = false;
    listEl.id = `${valueToId(ingredient.name)}-item`;
    listEl.tabIndex = -1;
    listEl.setAttribute('role', 'option');

    const checkBoxInput = document.createElement('input');
    checkBoxInput.type = 'checkbox';
    checkBoxInput.name = 'selected-ingredients';
    checkBoxInput.value = ingredient.name;
    checkBoxInput.id = valueToId(ingredient.name);
    checkBoxInput.tabIndex = -1;

    const label = document.createElement('label');
    label.htmlFor = checkBoxInput.id;
    const textNode = document.createTextNode(ingredient.name);

    listEl.append(checkBoxInput, label, textNode);
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
    #activeDescendant;
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
        this.#olList.addEventListener('click', this);
        this.#olList.addEventListener('keydown', this);
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
        let checkBox = element;
        if (typeof element === 'string') {
            checkBox = this.#namesToNodes.get(element);
        }
        checkBox.checked = true;
        checkBox.parentElement.ariaSelected = true;
        this.#ingredientList.selectIngredient(checkBox.value);
    }



    /**
     * 
     * @param {HTMLInputElement | string} element 
     */
    deselect(element) {
        let checkBox = element;
        if (typeof element === 'string') {
            checkBox = this.#namesToNodes.get(element);
        }
        this.#ingredientList.unselectIngredient(checkBox.value);
        checkBox.checked = false;
        checkBox.parentElement.ariaSelected = false;
    }

    /**
     * 
     * @param {import('../db/db.js').IngredientEntry[]} elements 
     */
    addAll(elements) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createSelectableListItem(element);
            // highlight selected elements.
            if (this.#ingredientList.hasIngredient(element.name)) {
                this.select(listEl.firstElementChild);
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#ingredientList.selectedIngredients, this.#olList);
        this.#olList.appendChild(frag);
    }

    /**
     * 
     * @param {import('../db/db.js').IngredientEntry[]} elements 
     */
    replaceChildrenWith(elements = []) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createSelectableListItem(element);
            // highlight selected elements.
            if (this.#ingredientList.hasIngredient(element.name)) {
                this.select(listEl.firstElementChild);
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
     * @param {HTMLInputElement} inputEl 
     */
    #handleInput(inputEl) {
        const { value } = inputEl;
        if (!this.#ingredientList.hasIngredient(value) && this.#ingredientList.canSelectMore()) {
            this.#ingredientList.selectIngredient(value);
            triggerIngredientSelected(inputEl, value);
        } else if (this.#ingredientList.hasIngredient(value)) {
            this.#ingredientList.unselectIngredient(value);
            triggerIngredientDeselected(inputEl, value);
        } else {
            inputEl.checked = false;
            triggerMaxSelected(inputEl);
        }
    }


    /**
     * 
     * @param {HTMLElement} element 
     */
    #focusItem(element) {
        this.#activeDescendant = element.id;
        this.#olList.setAttribute('aria-activedescendant', this.#activeDescendant);
        element.focus();
    }

    #clearActiveDescendant() {
        this.#activeDescendant = null;
        this.#olList.setAttribute('aria-activedescendant', null);
    }

    #moveUpItems() {}

    /**
     * 
     * @param {HTMLElement} currentOption 
     */
    #findNextOption(currentOption) {
        let nextOption = null;
        if (!isNullish(currentOption.nextElementSibling) && currentOption.nextElementSibling.hasAttribute('role')
        && currentOption.nextElementSibling.getAttribute('role') === 'option') {
            nextOption = currentOption.nextElementSibling;
        }
        return nextOption;
    }

    /**
     * 
     * @param {HTMLElement} currentOption 
     */
    #findPreviousOption(currentOption) {
        let nextOption = null;
        if (!isNullish(currentOption.previousElementSibling) && currentOption.previousElementSibling.hasAttribute('role')
        && currentOption.previousElementSibling.getAttribute('role') === 'option') {
            nextOption = currentOption.previousElementSibling;
        }
        return nextOption;
    }

    /**
     * 
     * @param {MouseEvent} evt 
     */
    #checkKeyPress(evt) {
        const allOptions = this.#olList.querySelectorAll('[role="option"]');
        const currentItem = this.#olList.querySelector(`#${this.#olList.getAttribute('aria-activedescendant')}`);
        let nextItem = currentItem;

        if (!currentItem) {
            return;
        }

        switch (evt.key) {
            case 'ArrowDown':
                if (!this.#activeDescendant) {
                    this.#focusItem(allOptions[0]);
                    break;
                }
                nextItem = this.#findNextOption(currentItem);
                if (nextItem) {
                    this.#focusItem(nextItem);
                    evt.preventDefault();
                }
                break;
            case 'ArrowUp':
                if (!this.#activeDescendant) {
                    this.#focusItem(allOptions[0]);
                    break;
                }
                nextItem = this.#findPreviousOption(currentItem);
                if (nextItem) {
                    this.#focusItem(nextItem);
                    evt.preventDefault();
                }
                break;
            case ' ':
                const inputEl = currentItem.firstElementChild;
                this.#handleInput(inputEl);
                evt.preventDefault();
                break;
        }
    }

    /**
     * Listens to change events.
     * @param {InputEvent | MouseEvent} evt 
     */
    handleEvent(evt) {
       switch(evt.type) {
           case 'click':
               evt.preventDefault();
               const optionLI = evt.target.closest('[role="option"]');
               this.#focusItem(optionLI);
               const inputEl = optionLI.firstElementChild;
               this.#handleInput(inputEl);
               break;
            
            case 'keydown':
                this.#checkKeyPress(evt);
                break;
            
            default:
                // Do nothing;
                break;
       }
    }
}