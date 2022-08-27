/** @module messaging */

/**
 * @typedef {import("./db/db").IngredientEntry} IngredientEntry
 * @typedef {import("../alchemy/alchemy").Potion} Potion
 */

/**
 * @template T
 * @typedef Message
 * @property {string} type the type of message.
 * @property {T} payload the payload to send to and from the worker.
 */

/**
 * The message sent to the main thread from the worker
 * @typedef {Message<string>} WorkerReadyMessage
 * 
 */

/**
 * The message sent to the worker from the main thread.
 * @typedef {Message<null>} PopulateMessage
 * 
 */

/**
 * The message sent to the worker from the main thread.
 * @typedef SearchMessagePayload
 * @property {string} effectSearchTerm
 * @property {string} effectOrder
 * @property {string[]} dlc
 */

/**
 * @typedef {IngredientEntry[]} PopulateResultPayload
 * @typedef {Message<PopulateResultPayload>} PopulateResultMessage
 * The resulting message sent to the main thread from the worker.
 */

/** 
 * @typedef {{results: IngredientEntry[], query: SearchMessagePayload}} SearchResultPayload
 * @typedef {Message<SearchResultPayload>} SearchResultMessage
 * The resulting message sent to the main thread from the worker.
 * 
 */

/** 
 * The payload sent to the worker.
 * @typedef CalculateMessagePayload
 * @property {string[]} ingredientNames 
 * @property {number} skill 
 * @property {number} alchemist 
 * @property {boolean} hasPhysician 
 * @property {boolean} hasBenefactor 
 * @property {boolean} hasPoisoner 
 * @property {number} fortifyAlchemy 
 */

/**
 * The message sent to the worker from the main thread.
 * @typedef {Message<CalculateMessagePayload>} CalculateMessage
 * 
 */



/** 
 * @typedef {Map<string, Potion>} CalculateResultPayload
 * @typedef {Message<CalculateResultPayload>} CalculateResultMessage
 * The result message sent to the main thread from the worker
 * 
 */

/**
 * The message sent to the worker from the main thread.
 * @typedef {Message<SearchMessagePayload>} SearchMessage
 * 
 */

/**
 * Constructs the message to be sent between threads.
 * @param {string} type 
 * @param {T} payload 
 * @returns {Message<T>}
 */
 function buildMessage(type, payload={}) {
    
    return {
        type: type,
        payload: payload
    };
}

/**
 * Creates an error message.
 * 
 * @param {string} message the text message.
 * @returns {Message<string>}
 */
export function buildErrorMessage(message='Error') {
    const workerMessage = buildMessage('error', message);
    return workerMessage;
}

function buildResultMessage(requestPrefix, result={}) {
    
    const message = buildMessage(`${requestPrefix}-result`, result);
    return message;
}

/**
 * 
 * 
 * @param {string} effectSearchTerm 
 * @param {string} effectOrder 
 * @param {string[]} dlc
 * @returns {SearchMessage}
 */
export function buildSearchMessage(effectSearchTerm, effectOrder, dlc) {
    const payload = {
        effectSearchTerm,
        effectOrder,
        dlc
    };
    /**
     * @type {Message<SearchMessage>}
     */
    const message = buildMessage('search', payload);
    return message;
}

/**
 * 
 * @type {import("./db/db.js").IngredientEntry}
 * @param {IngredientEntry[]} results 
 * @param {SearchMessagePayload} query 
 * @returns {Message<SearchResultMessage>}
 */
export function buildSearchResultMessage(results, query) {
    const message = buildResultMessage('search', {results, query});
    return message;
}

/**
 * 
 * @param {string} workerName 
 * @param {number} timestamp
 * @returns {Message<WorkerReadyMessage>}
 */
export function buildWorkerReadyMessage(workerName, timestamp=performance.now()) {
    const payload = {
        timestamp: timestamp,
        worker: workerName
    };
    const message = buildMessage('worker-ready', payload);
    return message;
}



/**
 * 
 * @param {string[]} populateResult 
 * @returns {Message<PopulateResultMessage>}
 */
export function buildPopulateResultMessage(populateResult) {
    const message = buildResultMessage('populate', populateResult);
    return message;
}

/**
 * 
 * @returns {Message<PopulateMessage>}
 */
export function buildPopulateMessage() {
    return buildMessage('populate');
}

/**
 * 
 * @param {string[]} ingredientNames 
 * @param {number} skill 
 * @param {number} alchemist 
 * @param {boolean} hasPhysician 
 * @param {boolean} hasBenefactor 
 * @param {boolean} hasPoisoner 
 * @param {number} fortifyAlchemy 
 * @returns {Message<CalculateMessage>}
 */
export function buildCalculateMessage(ingredientNames, skill=15, alchemist=0, hasPhysician=false, hasBenefactor=false, hasPoisoner=false, fortifyAlchemy=0) {
    const payload = {
        names: ingredientNames,
        skill,
        alchemist,
        hasBenefactor,
        hasPhysician,
        hasPoisoner,
        fortifyAlchemy
    };
    const message = buildMessage('calculate', payload);
    return message;
}

/**
 * @typedef {import("../alchemy/alchemy").Potion} Potion
 * @param {Potion} potion 
 * @returns {Message<CalculateResultMessage>}
 */
export function buildCalculateResultMessage(potion) {
    const message = buildResultMessage('calculate', potion);
    return message;
}

