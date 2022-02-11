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
    #idMap = new Map();
    

    /**
     * 
     * @param {string} stringId 
     * @returns {HTMLElement}
     */
    id(stringId) {
        if (this.#idMap.has(stringId)) {
            return this.#idMap.get(stringId);
        } else {
            const el = document.getElementById(stringId);
            this.#idMap.set(stringId, el);
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
 * 
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
 * @deprecated
 * @param {HTMLElement} parent 
 */
export function removeAllChildren(parent) {
    while (parent.firstElementChild) {
        parent.removeChild(parent.firstElementChild);
    }
}