import { IngredientList } from '../models/ingredient-list.js';
import { tag } from '../html/html.js';
import { triggerIngredientSelected, triggerIngredientDeselected, triggerMaxSelected, triggerListCleared } from '../events/client-side-events.js';
import { isNullish } from '../utils.js';

import '../components/ingredient-list-item.js';
import { IngredientListItem } from '../components/ingredient-list-item.js';

const dlcNameToAcronym = new Map([
    ['Dawnguard', 'DG'],
    ['Dragonborn', 'DB'],
    ['Hearthfire', 'HF']
]);

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
 * @param {import('../db/db.js').IngredientEntry} ingredient
 * @param {import('../messaging.js').SearchMessagePayload | null} query 
 * @returns {IngredientListItem}
 */
function createSelectableListItem(ingredient, query) {
    /**
     * @type {import('../components/ingredient-list-item.js').IngredientListItem}
     */
    const ingredientListItem = document.createElement('ingredient-list-item');
    ingredientListItem.value = ingredient.name;
    const textNode = document.createElement('span');
    textNode.textContent = ingredient.name;
    

    if (query !== null && typeof query !== 'undefined' && query.effectSearchTerm !== 'All') {

        // if current filtered effect is the first effect of ingredient
        // append span element with text of "1st"
        if (ingredient.effectNames[0] === query.effectSearchTerm) {
            textNode.classList.add('first-effect');
        }
        // if ingredient is not part of the base game,
        // append the DLC it's in.
        if (ingredient.dlc !== 'Vanilla') {
            ingredientListItem.dlc = dlcNameToAcronym.get(ingredient.dlc);
        }
        /* 
        If ingredient has any multipliers for current filtered effect (not including "All"),
        append them as sup tags in the format #.##x Mag/Dur/Cost 
        */
        if (query.effectSearchTerm !== 'All') {
            const ingredientEffect = ingredient.effects[ingredient.effectNames.indexOf(query.effectSearchTerm)];
            const {
                cost: { multiplier: costMultiplier },
                duration: { multiplier: durMultiplier },
                magnitude: { multiplier: magMultiplier }
            } = ingredientEffect;
            if (!Number.isInteger(costMultiplier)) {
                const costMultiplierTag = document.createElement('sup');
                costMultiplierTag.textContent = `${costMultiplier}x Cost`;
                costMultiplierTag.tabIndex = -1;
                costMultiplierTag.slot = 'multipliers';
                costMultiplierTag.classList.add('pill', 'multiplier');
                ingredientListItem.appendChild(costMultiplierTag);
            }

            if (!Number.isInteger(durMultiplier)) {
                const durMultiplierTag = document.createElement('sup');
                durMultiplierTag.textContent = `${durMultiplier}x Dur`;
                durMultiplierTag.tabIndex = -1;
                durMultiplierTag.slot = 'multipliers';
                durMultiplierTag.classList.add('pill', 'multiplier');
                ingredientListItem.appendChild(durMultiplierTag);
            }

            if (!Number.isInteger(magMultiplier)) {
                const magMultiplierTag = document.createElement('sup');
                magMultiplierTag.textContent = `${magMultiplier}x Mag`;
                magMultiplierTag.tabIndex = -1;
                magMultiplierTag.slot = 'multipliers';
                magMultiplierTag.classList.add('pill', 'multiplier');
                ingredientListItem.appendChild(magMultiplierTag);
            }
        }
    }
    ingredientListItem.append(textNode);
    return ingredientListItem;
}


export class IngredientListView {
    #olList;
    #ingredientList;
    #observer;
    /** @type {Map<string, IngredientListItem>} */
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
                            this.#namesToNodes.delete(node.value);
                        }
                    }
                    if (addedNodes.length > 0) {
                        for (const node of addedNodes.values()) {
                            this.#namesToNodes.set(node.value, node);
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
     * @param {IngredientListItem | string} element 
     */
    select(element) {
        let listItem = element;
        if (typeof element === 'string') {
            listItem = this.#namesToNodes.get(element);
        }
        /**
         * @type {IngredientListItem}
         */
        listItem.selected = true;
        this.#ingredientList.selectIngredient(listItem.value);
    }



    /**
     * 
     * @param {IngredientListItem | string} element 
     */
    deselect(element) {
        let checkBox = element;
        if (typeof element === 'string') {
            checkBox = this.#namesToNodes.get(element);
        }
        this.#ingredientList.unselectIngredient(checkBox.value);
        checkBox.selected = false;
    }

    /**
     * 
     * @param {import('../db/db.js').IngredientEntry[]} elements 
     * @param {import('../messaging.js').SearchMessagePayload} query 
     */
    addAll(elements, query = null) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createSelectableListItem(element, query);
            // highlight selected elements.
            if (this.#ingredientList.hasIngredient(element.name)) {
                this.select(listEl);
            }
            frag.appendChild(listEl);
        }
        saveAndFireListCleared(this.#ingredientList.selectedIngredients, this.#olList);
        this.#olList.appendChild(frag);
    }

    /**
     * 
     * @param {import('../db/db.js').IngredientEntry[]} elements 
     * @param {import('../messaging.js').SearchMessagePayload} query
     */
    replaceChildrenWith(elements = [], query = null) {
        const frag = new DocumentFragment();
        for (let element of elements) {
            const listEl = createSelectableListItem(element, query);
            // highlight selected elements.
            if (this.#ingredientList.hasIngredient(element.name)) {
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
     * @param {IngredientListItem} inputEl 
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
            inputEl.selected = false;
            triggerMaxSelected(inputEl);
        }
    }


    /**
     * 
     * @param {IngredientListItem} element 
     */
    #focusItem(element) {
        this.#activeDescendant = element.value;
        this.#olList.setAttribute('aria-activedescendant', this.#activeDescendant);
        element.focus();
    }

    #clearActiveDescendant() {
        this.#activeDescendant = null;
        this.#olList.setAttribute('aria-activedescendant', null);
    }

    #moveUpItems() { }

    /**
     * 
     * @param {HTMLElement} currentOption 
     */
    #findNextOption(currentOption) {
        let nextOption = null;
        if (!isNullish(currentOption.nextElementSibling)) {
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
        if (!isNullish(currentOption.previousElementSibling) ) {
            nextOption = currentOption.previousElementSibling;
        }
        return nextOption;
    }

    /**
     * 
     * @param {MouseEvent} evt 
     */
    #checkKeyPress(evt) {
        const allOptions = this.#olList.querySelectorAll('ingredient-list-item');
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
                const inputEl = currentItem;
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
        switch (evt.type) {
            case 'click':
                evt.preventDefault();
                /**
                 * @type {HTMLElement}
                 */
                const target = evt.target;
                const optionLI = target.closest('ingredient-list-item');
                this.#focusItem(optionLI);
                this.#handleInput(optionLI);
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