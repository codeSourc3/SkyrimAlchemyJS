import { parseIngredientsJSON } from './alchemy/ingredients.js';
import {tag, DomCache} from './infrastructure/html.js';

let isWorkerReady = false;
const alchemyWorker = new Worker('scripts/alchemy-worker.js', {type: 'module'});
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
    //const data = messageEvent.data;
    //console.log(data);
    let isEvent = 'data' in messageEvent && 'event' in messageEvent.data;
    if (isEvent && messageEvent.data.event === 'worker-ready') {
        isWorkerReady = true;
        alchemyWorker.postMessage(calculate(['Ancestor Moth Wing', 'Ash Creep Cluster']));
    }
}



function calculate(ingredientNames, skill=15, alchemist=0, hasPhysician=false, hasBenefactor=false, hasPoisoner=false, fortifyAlchemy=0) {
    return {
        names: ingredientNames,
        skill,
        alchemist,
        hasBenefactor,
        hasPhysician,
        hasPoisoner,
        fortifyAlchemy
    };
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

