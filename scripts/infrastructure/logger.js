import { isInRange } from "./math.js";

const LogLevel = Object.freeze({
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEFAULT: 4,
    DEBUG: 5
});
const lookupTable = new Map([
    ['error', 'ERROR'],
    ['warn', 'WARN'],
    ['info', 'INFO'],
    ['log', 'DEFAULT'],
    ['debug', 'DEBUG']
]);

let currentLogLevel = LogLevel.DEFAULT;
const filterableConsole = new Proxy(console, {
    get(target, prop, receiver) {
        if (typeof target[prop] !== 'function') {
            // not a function
            return target[prop];
        }
        return (...args) => {
            if (typeof prop === 'string') {
                let requiredLogLevel = LogLevel.DEFAULT;
                if (lookupTable.has(prop)) {
                    //
                    requiredLogLevel = LogLevel[lookupTable.get(prop)];
                }
                if (currentLogLevel >= requiredLogLevel) {
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
    if (isInRange(newLogLevel, LogLevel.ERROR, LogLevel.DEBUG)) {
        currentLogLevel = Number(newLogLevel);
    }
}


export {filterableConsole as logger, setLogLevel, LogLevel};