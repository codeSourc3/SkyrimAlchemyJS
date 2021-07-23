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