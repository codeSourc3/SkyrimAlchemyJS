/**
 * @module alchemy/effects
 */
/**
 * @typedef Effect
 * @property {string} name 
 * @property {string} description
 * @property {number} baseCost
 * @property {number} baseMag
 * @property {number} baseDur
 * @property {boolean} variableMagnitude
 * @property {boolean} variableDuration
 */

/**
 * @type {Effect}
 */
 export const restoreHealth = {
    name: 'Restore Health',
    description: "Restore <mag> points of Health.",
    baseCost: 0.5,
    baseMag: 5,
    baseDur: 0,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

/**
 * @type {Effect}
 */
export const restoreMagicka = {
    name: 'Restore Magicka',
    description: "Restore <mag> points of Magicka.",
    baseCost: 0.6,
    baseMag: 5,
    baseDur: 0,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

/**
 * @type {Effect}
 */
export const restoreStamina = {
    name: 'Restore Stamina',
    description: "Restore <mag> Stamina.",
    baseCost: 0.6,
    baseMag: 5,
    baseDur: 0,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};