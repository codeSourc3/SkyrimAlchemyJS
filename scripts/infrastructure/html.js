export function tag(tagName, {content='', classes=[], id='', parent, children=[]}) {
    /**
     * @type {HTMLElement}
     */
    const el = document.createElement(tagName);
    el.textContent = content;
    el.id = id;
    if (parent instanceof HTMLElement) {
        parent.appendChild(el);
    }
    el.classList.add(...classes);
    el.append(...children);
    return el;
}

export class DomCache {
    constructor() {
        this._elMap = new Map();
    }

    /**
     * 
     * @param {string} stringId 
     * @returns {HTMLElement}
     */
    id(stringId) {
        if (this._elMap.has(stringId)) {
            return this._elMap.get(stringId);
        } else {
            const el = document.getElementById(stringId);
            this._elMap.set(stringId, el);
            return el;
        }
    }
    
}

/**
 * Creates a bunch of HTMLLIElements and attaches them to a DocumentFragment.
 * @param {string[]} elements the text content to attach to the list item.
 * @returns {DocumentFragment}
 */
export function createList(elements=[]) {
    const domFrag = document.createDocumentFragment();
    console.assert(Array.isArray(elements), 'Create list expects an array of elements.');
    elements.forEach(value => {
        const listItem = document.createElement('li');
        listItem.textContent = value;
        domFrag.append(listItem);
    });
    return domFrag;
}

/**
 * Creates an unconnected list item element
 * @param {string} textContent the text node to place inside.
 * @returns {HTMLLIElement} an unattached list item element.
 */
export function createListItem(textContent = '') {
    const listItem = document.createElement('li');
    listItem.textContent = textContent;
    return listItem;
}

/**
 * 
 * @param {HTMLElement} parent 
 */
export function removeAllChildren(parent) {
    console.info('Child element count: %d', parent.children.length);
    while (parent.firstElementChild) {
        parent.removeChild(parent.firstElementChild);
    }
}