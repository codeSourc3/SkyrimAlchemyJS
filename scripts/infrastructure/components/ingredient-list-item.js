import { LitElement, html, nothing } from "lit";


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

    /**
     * @type {import("lit").PropertyDeclaration}
     */
    static properties = {
        selected: { type: Boolean },
        dlc: {type: String},
        value: {type: String},
        count: {type: Number}
    };

    constructor() {
        super();
        this.selected = false;
        this.dlc = '';
        this.value = '';
        this.count = 0;
    }

    render() {
        return html`
        <li aria-selected=${this.selected} id="${valueToId(this.value)}-item" tabindex="-1" role="option">
            <input type="checkbox" name="selected-ingredients" value=${this.value} id=${valueToId(this.value)} tabindex="-1">
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