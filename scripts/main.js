import {buildPopulateMessage} from './infrastructure/messaging.js';
let isWorkerReady = false;
const alchemyWorker = new Worker('scripts/alchemy-worker.js', {type: 'module', name: 'mixer'});
//const domCache = new DomCache();
alchemyWorker.onmessage = handleWorkerMessage;
//alchemyWorker.onmessageerror = handleWorkerMessageError;
alchemyWorker.onerror = handleWorkerError;
window.addEventListener('beforeunload', (e) => {
    console.log('Terminating Worker');
    alchemyWorker.terminate();
});


/**
 * 
 * @param {MessageEvent} messageEvent 
 */
function handleWorkerMessage(messageEvent) {
    const {type, payload} = messageEvent.data;
    
    switch (type) {
        case 'worker-ready':
            onWorkerReady();
            break;
        case 'search-result':
            onSearchResult(payload);
            break;
        case 'populate-result':
            onPopulateResult(payload);
            break;
        case 'calculate-result':
            onCalculateResult(payload);
            break;
        case 'error':
            onErrorMessage(payload);
            break;
        default:
            onUnknownMessage(type);
            break;
    }

    
}

function onUnknownMessage(type) {
    console.error(`${type} is not a valid message type.`);
}

function onErrorMessage(message) {
    console.error(`Error: ${message}`);
}

function onCalculateResult(payload) {
    console.log('Worker calculation results: ', payload);
}

function onSearchResult(payload) {
    console.log('Worker search results: ', payload);
}

/**
 * 
 * @param {import('./infrastructure/db.js').IngredientEntry[]} payload 
 */
function onPopulateResult(payload) {
    console.log('Worker populate result: ', payload);
}

function onWorkerReady() {
    const message = buildPopulateMessage();
    alchemyWorker.postMessage(message);
}


/**
 * 
 * @param {ErrorEvent} messageEvent 
 */
function handleWorkerMessageError(messageEvent) {
    console.error(`Worker Message Error at file %s of line %d`, messageEvent.filename, messageEvent.lineno);
}

/**
 * 
 * @param {ErrorEvent} messageEvent 
 */
function handleWorkerError(messageEvent) {
    console.info('Default prevented: ', messageEvent.defaultPrevented);
    console.info('Source: ', messageEvent.target);
    console.info('Cancelable: ', messageEvent.cancelable);
    console.log('Event type: ', messageEvent.type);
    console.info('Message from main thread error handler: ', messageEvent.message);
    console.info('Line Nr: ', messageEvent.lineno);
    console.info('Return Value: ', messageEvent.returnValue);
    console.info('Error: ', messageEvent.error)
}

