/** @module messaging */
/**
 * @typedef Message
 * @property {string} type the type of message.
 * @property {Object} payload the payload to send to and from the worker.
 */

/**
 * @typedef SearchMessagePayload
 * @property {string} effectSearchTerm
 * @property {string} effectOrder
 * @property {string[]} dlc
 */

/**
 * @typedef SearchMessage
 * @property {string} type the type of the message.
 * @property {SearchMessagePayload} payload the search payload.
 */

/**
 * Constructs the message to be sent between threads.
 * @param {string} type 
 * @param {any} payload 
 * @returns {Message}
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
 * @returns {Message}
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
 * @returns 
 */
export function buildSearchMessage(effectSearchTerm, effectOrder, dlc) {
    const payload = {
        effectSearchTerm,
        effectOrder,
        dlc
    };
    const message = buildMessage('search', payload);
    return message;
}

export function buildSearchResultMessage(results) {
    const message = buildResultMessage('search', results);
    return message;
}

export function buildWorkerReadyMessage(workerName, timestamp=performance.now()) {
    const payload = {
        timestamp: timestamp,
        worker: workerName
    };
    const message = buildMessage('worker-ready', payload);
    return message;
}




export function buildPopulateResultMessage(populateResult) {
    const message = buildResultMessage('populate', populateResult);
    return message;
}

export function buildPopulateMessage() {
    return buildMessage('populate');
}

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

export function buildCalculateResultMessage(potion) {
    const message = buildResultMessage('calculate', potion);
    return message;
}

