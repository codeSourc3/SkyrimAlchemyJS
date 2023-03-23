import { KeyboardController } from "./keyboard-controller.js";

export class ListBoxController {
    host;

    /**
     * @type {HTMLElement}
     */
    focusedItem;

    //  TODO: no callbacks being added when adding them.
    /**
     * 
     * @param {import('lit').LitElement} host 
     */
    constructor(host) {
        (this.host = host).addController(this);
        this.keyboardController = new KeyboardController(host);
        
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    _focusItem(element) {
        this.focusedItem.tabIndex = -1;
        this.focusedItem = element;
        this.focusedItem.tabIndex = 0;
        this.focusedItem.focus();
    }

    hostConnected() {
        this.host.firstElementChild.setAttribute('tabindex', '0');
        this.focusedItem = this.host.firstElementChild;
        console.debug('List box connected')
        this.keyboardController.addKeyDownListener('ArrowDown', evt => {
            let nextItem = this._findNextOption(this.focusedItem);
            console.debug('Next Item', nextItem);
            if (nextItem) {
                this._focusItem(nextItem);
                evt.preventDefault();
            }
        });
        this.keyboardController.addKeyDownListener('ArrowUp', evt => {
            let nextItem = this._findPreviousOption(this.focusedItem);
            console.debug('Previous Item', nextItem);
            if (nextItem) {
                this._focusItem(nextItem);
                evt.preventDefault();
            }
        });
        this.keyboardController.addKeyDownListener(' ', evt => {
            this.focusedItem.toggleAttribute('selected');
            evt.preventDefault();
        });
        
    }

    /**
     * 
     * @param {HTMLElement} currentOption 
     */
    _findPreviousOption(currentOption) {
        let previousOption = null;
        if (currentOption.previousElementSibling !== null) {
            previousOption = currentOption.previousElementSibling;
        }
        return previousOption;
    }

    /**
     * 
     * @param {HTMLElement} currentOption 
     */
    _findNextOption(currentOption) {
        let nextOption = null;
        if (currentOption.nextElementSibling !== null) {
            nextOption = currentOption.nextElementSibling;
        }
        return nextOption;
    }

    hostDisconnected() {
        //
    }
}