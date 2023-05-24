

/**
 * Maps out keyboard keys to actions for Lit.js
 */
export class KeyboardController {
    host;

    /**
     * a map of keyboard keys to callbacks
     * @type {Map<string, keyboardCb[]>}
     * @private
     */
    _keyUpCallbacks = new Map();

    /**
     * a map of keyboard keys to callbacks
     * @type {Map<string, keyboardCb[]>}
     * @private
     */
    _keyDownCallbacks = new Map();

    /**
     * 
     * @param {import('lit').ReactiveControllerHost} host 
     */
    constructor(host) {
        (this.host = host).addController(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._handleKeyUp = this._handleKeyUp.bind(this);
    }


    /**
     * 
     * @param {KeyboardEvent} evt 
     * @private
     */
    _handleKeyUp(evt) {
        if (this._keyUpCallbacks.has(evt.key)) {
            let callbacks = this._keyUpCallbacks.get(evt.key);
            for (const cb of callbacks) {
                cb(evt);
            }
        }
    }

    /**
     * 
     * @param {KeyboardEvent} evt 
     * @private
     */
    _handleKeyDown(evt) {
        console.debug('handling key down callbacks')
        if (this._keyDownCallbacks.has(evt.key)) {
            this._keyDownCallbacks.get(evt.key).forEach(cb => {
                console.debug('executing cb')
                cb(evt);
            });
        }
    }

    /**
     * Adds a keyboard listener for when the corresponding key's
     * 'keyup' event is fired.
     * 
     * @param {string} key the key to listen for.
     * @param {keyboardCb} cb 
     */
    addKeyUpListener(key, cb) {
        console.debug('adding key up listener');
        if (this._keyUpCallbacks.has(key)) {
            this._keyUpCallbacks.get(key).push(cb);
        } else {
            this._keyUpCallbacks.set(key, [cb]);
        }
        this.host.requestUpdate();
    }

    /**
     * Adds a keyboard listener for when the corresponding key's
     * 'keydown' event is fired.
     * 
     * @param {string} key the key to listen for.
     * @param {keyboardCb} cb the callback to execute.
     */
    addKeyDownListener(key, cb) {
        console.debug('adding keydown listener');
        if (this._keyDownCallbacks.has(key)) {
            this._keyDownCallbacks.get(key).push(cb);
        } else {
            this._keyDownCallbacks.set(key, [cb]);
        }
        this.host.requestUpdate();
    }

    /**
     * Removes the keyboard listener for the corresponding key.
     * 
     * @param {string} key the key to remove.
     * @param {keyboardCb} cb the callback to remove.
     */
    removeKeyUpListener(key, cb) {
        if (this._keyUpCallbacks.has(key)) {
            let callbacks = this._keyUpCallbacks.get(key);
            callbacks.splice(callbacks.indexOf(cb), 1);
        }
    }

    /**
     * Removes the keyboard listener for the corresponding key.
     * 
     * @param {string} key the key to remove.
     * @param {keyboardCb} cb the callback to remove
     */
    removeKeyDownListener(key, cb) {
        if (this._keyDownCallbacks.has(key)) {
            let callbacks = this._keyDownCallbacks.get(key);
            callbacks.splice(callbacks.indexOf(cb), 1);
        }
    }

    hostConnected() {
        window.addEventListener('keydown', this._handleKeyDown);
        window.addEventListener('keyup', this._handleKeyUp);
    }

    hostDisconnected() {
        this._keyDownCallbacks.clear();
        this._keyUpCallbacks.clear();
        window.removeEventListener('keydown', this._handleKeyDown);
        window.removeEventListener('keyup', this._handleKeyUp);
    }
}
/**
 * @callback keyboardCb
 * @param {KeyboardEvent} evt the keyboard event.
 * @return  {void}
 */