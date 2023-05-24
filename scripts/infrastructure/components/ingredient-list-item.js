import { LitElement, html, nothing } from "lit";


class AriaOptionController {
    /**
     * @type {LitElement}
     */
    host;

    /**
     * 
     * @param {import("lit").ReactiveControllerHost} host 
     */
    constructor(host) {
        (this.host = host).addController(this);
    }

    hostConnected() {
        this.host.setAttribute('role', 'option');
        this.host.setAttribute('aria-selected', '');
        if (this.host.hasAttribute('value')) {
            let optionValue = this.host.getAttribute('value');
            this.host.setAttribute('id', `${valueToId(optionValue)}-item`);
        }
        this.host.setAttribute('tabindex', '-1');

    }

    hostUpdated() {
        let selected = this.host.hasAttribute('selected')
        this.host.setAttribute('aria-selected', selected);
        if (this.host.hasAttribute('value')) {
            let optionValue = this.host.getAttribute('value');
            this.host.setAttribute('id', `${valueToId(optionValue)}-item`);
        }
    }
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

export class IngredientListItem extends LitElement {

    ariaController = new AriaOptionController(this);
    /**
     * @type {import("lit").PropertyDeclaration}
     */
    static properties = {
        selected: { type: Boolean, reflect: true },
        dlc: {type: String, reflect: true},
        value: {type: String, reflect: true},
        count: {type: Number, reflect: true}
    };

    constructor() {
        super();
        /**
         * @type {boolean}
         */
        this.selected = false;
        /**
         * @type {string}
         */
        this.dlc = '';
        /**
         * @type {string}
         */
        this.value = '';
        /**
         * @type {number}
         */
        this.count = 0;
    }

    render() {
        return html`
        <li>
            <input type="checkbox" name="selected-ingredients" value=${this.value} id=${valueToId(this.value)} tabindex="-1" ?checked=${this.selected}>
            <label for=${valueToId(this.value)}></label>
            <span>
                <slot></slot>
                ${this.dlc ? html`
                <sup tabindex="-1" class="pill dlc"> ${this.dlc}</sup>
                ` : nothing}
                <span>
                    <slot name="multipliers"></slot>
                </span>
            </span>
        </li>
        `
    }
}

customElements.define('ingredient-list-item', IngredientListItem);