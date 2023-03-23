import { html, LitElement } from "lit";
import { ListBoxController } from "./controllers/ListBoxController";
import { IngredientListItem } from "./ingredient-list-item";




export class IngredientList extends LitElement {
    listBoxController = new ListBoxController(this);

    /**
     * @type {import("lit").PropertyDeclarations}
     */
    static properties = {
        _selectedItems: {state: true},
        _items: {state: true}
    };

    constructor() {
        super();
        /**
         * @private
         * @type {IngredientListItem[]}
         */
        this._items = [];
        /**
         * @private
         * @type {IngredientListItem[]}
         */
        this._selectedItems = [];
        
    }

    /**
     * 
     * @param {Event} evt 
     */
    handleSlotChange(evt) {
        /**
         * @type {Element[]}
         */
        const childElements = (evt.target).assignedElements({flatten: true});
        this._items = childElements.filter((element) => {
            return element.nodeName === 'ingredient-list-item'
        });
        // remove elements that are no longer part of the list
        this._selectedItems = this._items.filter((element) => {
            // Would do an exact match (same object in memory).
            return element.matches('*[selected]');
        });
    }

    /**
     * Returns all selected options in the list.
     */
    get selectedItems() {
        return [...this._selectedItems];
    }

    /**
     * Returns all options in the list.
     */
    get items() {
        return [...this._items];
    }

    /**
     * @private
     */
    get _defaultSlot() {
        return this.renderRoot.querySelector('slot');
    }

    // TODO: Add click handler

    /**
     * 
     * @param {Event} evt 
     */
    handleClick(evt) {
        /**
         * @type {IngredientListItem}
         */
        const option = evt.target;
        if (!option.selected) {
            const ingredientSelectedEvt = new CustomEvent('ingredient-selected', {
                bubbles: true, cancelable: true, composed: true, detail: {ingredientName: option.value}
            });
            if (option.dispatchEvent(ingredientSelectedEvt)) {
                // if ingredient selection hasn't been canceled.
                option.selected = true;
                this._selectedItems = [...this._selectedItems, option];
            }
        } else {
            const ingredientDeselectedEvt = new CustomEvent('ingredient-deselected',{
                bubbles: true, cancelable: true
            });
            this.dispatchEvent(ingredientDeselectedEvt);
            option.selected = false;
            this._selectedItems = this._selectedItems.filter(el => el.selected);
        }
    }

    render() {
        return html`
            <ol>
                <slot @click=${this.handleClick} @slotchange=${this.handleSlotChange}><p>No results.</p></slot>
            </ol>
        `;
    }
}
customElements.define('ingredient-list', IngredientList);