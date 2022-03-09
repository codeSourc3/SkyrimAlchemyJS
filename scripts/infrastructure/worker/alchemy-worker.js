import { WORKER_READY, INGREDIENT_SEARCH_RESULT, POPULATE_INGREDIENT_LIST, CALCULATE_POTION_RESULT, WORKER_ERROR, triggerWorkerReady, triggerSearchEvt, triggerPopulate, triggerCalculatePotionEvt, triggerWorkerError } from "../events/client-side-events.js";
import { buildCalculateMessage, buildPopulateMessage, buildSearchMessage } from "../messaging.js";

const eventDelegator = {
    target: null,
    ['worker-ready']() {
        triggerWorkerReady(this.target);
    },
    /**
     * 
     * @param {string[]} payload 
     */
    ['search-result'](payload) {
        console.assert(Array.isArray(payload) && payload.every(item => typeof item === 'string'), 'Message handler switch docs need updating.');
        triggerSearchEvt(this.target, payload);
    },
    /**
     * 
     * @param {string[]} payload 
     */
    ['populate-result'](payload) {
        console.assert(Array.isArray(payload) && payload.every(item => typeof item === 'string'), 'Message handler switch docs need updating.');
        triggerPopulate(this.target, payload);
    },
    /**
     * 
     * @param {import("../../alchemy/alchemy.js").Potion} payload 
     */
    ['calculate-result'](payload)  {
        console.dir(payload);
        triggerCalculatePotionEvt(this.target, payload);
    },
    ['worker-error'](payload)  {
        triggerWorkerError(this.target, payload);
    },
    /**
     * 
     * @param {string} type - The message type.
     */
    ['default'](type) {
        this.onUnknownMessage(type);
    },
    onUnknownMessage: null
};

export class AlchemyWorker {
    #worker;
    #port;
    /**
     * Creates a worker from the specified path and attaches an event listener
     * to it.
     * 
     * @param {string | URL} aPath - The relative path to the worker script from the caller.
     */
    constructor(aPath) {
        this.#worker = new Worker(aPath, {type: 'module', name: 'mixer'});
        const channel = new MessageChannel();
        this.#port = channel.port1;
        /**
         * Called on an unknown message being sent.
         * 
         * @param {string} type - The message type sent to the worker.
         * @returns {void}
         */
        this.onUnknownMessage = (type) => console.debug(`${type} is not a valid message type.`);
        eventDelegator.target = this.#port;
        eventDelegator['calculate-result'].bind(this.#port);
        eventDelegator['populate-result'].bind(this.#port);
        eventDelegator.onUnknownMessage = this.onUnknownMessage;
        /**
         * Converts MessageEvent data to CustomEvents and dispatches them on the worker.
         * @param {MessageEvent<any>} evt - The message event sent to the worker.
         */
        const messageHandler = (evt) => {
            console.log(`Message ${evt.type}`);
            const {type, payload} = evt.data;
            let strType = String(type);
            if (strType in eventDelegator) {
                eventDelegator[strType](payload);
            } else {
                eventDelegator['default'](type);
            }
        };
        this.#port.addEventListener('message', messageHandler);
        this.#port.start();
        this.#worker.postMessage({type: 'init'}, [channel.port2]);
    }

    onWorkerReady(callback) {
        if (typeof callback === 'function') {
            this.#port.addEventListener(WORKER_READY, callback);
        }
    }

    onIngredientSearchResult(callback) {
        if (typeof callback === 'function') {
            this.#port.addEventListener(INGREDIENT_SEARCH_RESULT, callback);
        }
    }

    onPopulateIngredientList(callback) {
        if (typeof callback === 'function') {
            this.#port.addEventListener(POPULATE_INGREDIENT_LIST, callback);
        }
    }

    onCalculateResult(callback) {
        if (typeof callback === 'function') {
            this.#port.addEventListener(CALCULATE_POTION_RESULT, callback);
        }
    }

    onWorkerError(callback) {
        if (typeof callback === 'function') {
            this.#port.addEventListener(WORKER_ERROR, callback);
        }
    }

    postMessage(message) {
        this.#port.postMessage(message);
    }

    /**
     * Sends a search message to the worker. This is used to filter
     * ingredients.
     * @param {string} effectSearchTerm - The effect search term.
     * @param {"asc" | "desc"} effectOrder - The effect search order. "asc" | "desc"
     * @param {string[]} dlc - An array of DLC to include. Should always have "Vanilla".
     */
    sendSearchMessage(effectSearchTerm, effectOrder, dlc) {
        const searchMsg = buildSearchMessage(effectSearchTerm, effectOrder, dlc);
        this.#port.postMessage(searchMsg);
    }

    /**
     * Sends a populate message to the worker.
     */
    sendPopulateMessage() {
        const populateMsg = buildPopulateMessage();
        this.#port.postMessage(populateMsg);
    }

    /**
     * Sends a calculate message to the worker.
     * @param {string[]} ingredientNames - A case-sensitive array of ingredient names.
     * @param {number} skill - A positive integer higher than 15.
     * @param {number} alchemist - An integer between 0 and 5 inclusive
     * @param {boolean} hasPhysician - Whether or not the player has the Physician perk or not.
     * @param {boolean} hasBenefactor - Whether or not the player has the Benefactor perk or not.
     * @param {boolean} hasPoisoner - Whether or not the player has the Poisoner perk or not.
     * @param {number} fortifyAlchemy - The total percentage from all equipment enchanted with Fortify Alchemy.
     */
    sendCalculateMessage(ingredientNames, skill=15, alchemist=0, hasPhysician=false, hasBenefactor=false, hasPoisoner=false, fortifyAlchemy=0) {
        const calculateMsg = buildCalculateMessage(ingredientNames, skill, alchemist, hasPhysician, hasBenefactor, hasPoisoner, fortifyAlchemy);
        this.#port.postMessage(calculateMsg);
    }


    terminate() {
        this.#worker.terminate();
    }

    static get WORKER_READY() {
        return 'worker-ready';
    }

    static get POPULATE_INGREDIENT_LIST() {
        return 'populate-ingredient-list';
    }

    static get INGREDIENT_SEARCH_RESULT() {
        return 'ingredient-search-result';
    }

    static get CALCULATE_POTION_RESULT() {
        return 'calculate-potion-result';
    }

    static get WORKER_ERROR() {
        return 'worker-error';
    }
}