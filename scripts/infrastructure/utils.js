export function isNullish(value) {
    return typeof value === 'undefined' || value === null;
}

export const compose = (...funcs) => (...args) => {
    return funcs.reduceRight((args, fn) => fn(...args), args);
};

export const pipe = (...funcs) => (...args) => {
    return funcs.reduce((args, fn) => fn(...args), args);
};

export const eq = b => a => a === b;

export const not = fn => (...args) => !fn(...args);

export const and = (...funcs) => (...args) => {
    return funcs.reduce((a, b) => {
        return a(...args) && b(...args);
    });
};

export const or = (...funcs) => (...args) => {
    return funcs.reduce((a, b) => {
        return a(...args) || b(...args);
    });
};

export const compareFloats = (a, b, tolerance=0.0001) => {
    return Math.abs(a - b) < tolerance;
};