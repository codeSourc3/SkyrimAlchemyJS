import { createCalculatePotionResult, createWorkerError, createPopulateIngredientList, createIngredientSearchResult, createWorkerReady, WORKER_READY, INGREDIENT_SEARCH_RESULT, POPULATE_INGREDIENT_LIST, CALCULATE_POTION_RESULT, WORKER_ERROR } from "../events/client-side-events.js";
import { buildCalculateMessage, buildPopulateMessage, buildSearchMessage } from "../messaging.js";

const messageHandlerSwitch = {
    worker: null,
    ['worker-ready']() {
        const workerReady = createWorkerReady();
        this.worker.dispatchEvent(workerReady);
    },
    ['search-result'](payload) {
        const ingredientSearchResult = createIngredientSearchResult(payload);
        this.worker.dispatchEvent(ingredientSearchResult);
    },
    ['populate-result'](payload) {
        const populateEvt = createPopulateIngredientList(payload);
        this.worker.dispatchEvent(populateEvt);
    },
    ['calculate-result'](payload)  {
        const calculateResult = createCalculatePotionResult(payload);
        this.worker.dispatchEvent(calculateResult);
    },
    ['error'](payload)  {
        const errorResult = createWorkerError(payload);
        this.worker.dispatchEvent(errorResult);
    },
    ['default'](type) {
        this.onUnknownMessage(type);
    },
    onUnknownMessage: null
};

export class AlchemyWorker {
    #worker
    constructor(aPath) {
        this.#worker = new Worker(aPath, {type: 'module', name: 'mixer'});
        this.onUnknownMessage = (type) => console.debug(`${type} is not a valid message type.`);
        messageHandlerSwitch.worker = this.#worker;
        messageHandlerSwitch['calculate-result'].bind(this.#worker);
        messageHandlerSwitch['populate-result'].bind(this.#worker);
        messageHandlerSwitch.onUnknownMessage = this.onUnknownMessage;
        const messageHandler = (evt) => {
            const {type, payload} = evt.data;
            let strType = String(type);
            if (strType in messageHandlerSwitch) {
                messageHandlerSwitch[strType](payload);
            } else {
                messageHandlerSwitch['default'](type);
            }
        };
        this.#worker.addEventListener('message', messageHandler);
    }

    onWorkerReady(callback) {
        if (typeof callback === 'function') {
            this.#worker.addEventListener(WORKER_READY, callback);
        }
    }

    onIngredientSearchResult(callback) {
        if (typeof callback === 'function') {
            this.#worker.addEventListener(INGREDIENT_SEARCH_RESULT, callback);
        }
    }

    onPopulateIngredientList(callback) {
        if (typeof callback === 'function') {
            this.#worker.addEventListener(POPULATE_INGREDIENT_LIST, callback);
        }
    }

    onCalculateResult(callback) {
        if (typeof callback === 'function') {
            this.#worker.addEventListener(CALCULATE_POTION_RESULT, callback);
        }
    }

    onWorkerError(callback) {
        if (typeof callback === 'function') {
            this.#worker.addEventListener(WORKER_ERROR, callback);
        }
    }

    postMessage(message) {
        this.#worker.postMessage(message);
    }

    /**
     * Sends a search message to the worker. This is used to filter
     * ingredients.
     * @param {string} effectSearchTerm 
     * @param {string} effectOrder 
     * @param {string[]} dlc 
     */
    sendSearchMessage(effectSearchTerm, effectOrder, dlc) {
        const searchMsg = buildSearchMessage(effectSearchTerm, effectOrder, dlc);
        this.#worker.postMessage(searchMsg);
    }

    /**
     * Sends a populate message to the worker.
     */
    sendPopulateMessage() {
        const populateMsg = buildPopulateMessage();
        this.#worker.postMessage(populateMsg);
    }

    /**
     * Sends a calculate message to the worker.
     * @param {string[]} ingredientNames 
     * @param {number} skill 
     * @param {number} alchemist 
     * @param {boolean} hasPhysician 
     * @param {boolean} hasBenefactor 
     * @param {boolean} hasPoisoner 
     * @param {number} fortifyAlchemy 
     */
    sendCalculateMessage(ingredientNames, skill=15, alchemist=0, hasPhysician=false, hasBenefactor=false, hasPoisoner=false, fortifyAlchemy=0) {
        const calculateMsg = buildCalculateMessage(ingredientNames, skill, alchemist, hasPhysician, hasBenefactor, hasPoisoner, fortifyAlchemy);
        this.#worker.postMessage(calculateMsg);
    }


    terminate() {
        this.#worker.terminate();
    }
}