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
     * 
     * @param {IngredientListItem} element 
     */
    select(element) {
        if (this._items.includes(element)) {
            element.selected = true;
            this._selectedItems = this._items.filter(element => {
                return element.matches('*[selected]');
            });
        }
    }

    /**
     * 
     * @param {IngredientListItem} element 
     */
    deselect(element) {
        if (this._items.includes(element)) {
            element.selected = false;
            this._selectedItems = this._items.filter(element => {
                return element.matches('*[selected]');
            });
        }
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
        const option = evt.target.closest('ingredient-list-item');

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
                bubbles: true, cancelable: true, detail: {ingredientName: option.value}
            });
            this.dispatchEvent(ingredientDeselectedEvt);
            option.selected = false;
            this._selectedItems = this._selectedItems.filter(el => el.selected);
        }
    }

    render() {
        return html`
            <ol @click=${this.handleClick}>
                <slot @slotchange=${this.handleSlotChange}><p>No results.</p></slot>
            </ol>
        `;
    }
}
customElements.define('ingredient-list', IngredientList);
export {IngredientList as HTMLIngredientList};