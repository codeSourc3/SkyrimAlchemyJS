import { isInRange } from "./math.js";


const LogLevel = Object.freeze({
    ERROR: 5,
    WARN: 4,
    DEFAULT: 3,
    INFO: 2,
    DEBUG: 1
});
const lookupTable = new Map([
    ['error', 'ERROR'],
    ['warn', 'WARN'],
    ['info', 'INFO'],
    ['log', 'DEFAULT'],
    ['debug', 'DEBUG'],
    ['assert', 'ERROR']
]);

const getRequiredLogLevel = (funcName) => {
    let requiredLevel = LogLevel.DEBUG;
    if (lookupTable.has(funcName)) {
        requiredLevel = LogLevel[lookupTable.get(funcName)];
    }
    return requiredLevel;
};

let currentLogLevel = LogLevel.DEFAULT;
const filterableConsole = new Proxy(console, {
    get(target, prop, receiver) {
        if (typeof target[prop] !== 'function') {
            // not a function
            return target[prop];
        }
        return (...args) => {
            if (typeof prop === 'string') {
                let requiredLogLevel = getRequiredLogLevel(prop);
                // check if current level is 
                if (currentLogLevel <= requiredLogLevel) {
                    return target[prop].apply(target, args);
                } else {
                    // do nothing if current log level isn't high enough.
                    return;
                }
            }
            return target[prop](args);
        };
    }
});

function setLogLevel(newLogLevel) {
    if (isInRange(newLogLevel, LogLevel.DEBUG, LogLevel.ERROR)) {
        currentLogLevel = Number(newLogLevel);
    } else {
        console.error('Tried to set log level to invalid value.');
    }
}


export {filterableConsole as logger, setLogLevel, LogLevel};