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
export const cureDisease = {
    name: 'Cure Disease',
    description: 'Cures all diseases.',
    baseCost: 0.5,
    baseMag: 5,
    baseDur: 0,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

/** @type {Effect} */
export const curePoison = {
    name: 'Cure Poison',
    description: 'Stops poison\'s continuing effects.',
    baseCost: 0.2,
    baseMag: 2,
    baseDur: 0,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const damageHealth = {
    name: 'Damage Health',
    description: 'Causes <mag> points of poison damage.',
    baseCost: 3,
    baseMag: 2,
    baseDur: 1,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true 
};

export const damageMagicka = {
    name: 'Damage Magicka',
    description: "Drains the target's Magicka by <mag> points.",
    baseCost: 2.2,
    baseMag: 3,
    baseDur: 0,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const damageMagickaRegen = {
    name: 'Damage Magicka Regen',
    description: "",
    baseCost: 0.5,
    baseMag: 100,
    baseDur: 5,
    variableMagnitude: false,
    variableDuration: true,
    harmful: true
};

export const damageStamina = {
    name: 'Damage Stamina',
    description: "Drain the target's Stamina by <mag> points.",
    baseCost: 1.8,
    baseMag: 3,
    baseDur: 0,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const damageStaminaRegen = {
    name: 'Damage Stamina Regen',
    description: "Decrease the target's Stamina regeneration by <mag>% for <dur> seconds.",
    baseCost: 0.3,
    baseMag: 100,
    baseDur: 5,
    variableMagnitude: false,
    variableDuration: true,
    harmful: true
};

export const fear = {
    name: 'Fear',
    description: "Creatures and people up to level <mag> flee from combat for <dur> seconds.",
    baseCost: 5,
    baseMag: 1,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const fortifyAlteration = {
    name: 'Fortify Alteration',
    description: "Alteration spells last <mag>% longer for <dur> seconds.",
    baseCost: 0.2,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyBarter = {
    name: 'Fortify Barter',
    description: "You haggle for <mag>% better prices for <dur> seconds.",
    baseCost: 2,
    baseMag: 1,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyBlock = {
    name: 'Fortify Block',
    description: "Blocking absorbs <mag>% more damage for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyCarryWeight = {
    name: 'Fortify Carry Weight',
    description: "Carrying capacity increases by <mag> for <dur> seconds.",
    baseCost: 0.15,
    baseMag: 4,
    baseDur: 300,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyConjuration = {
    name: 'Fortify Conjuration',
    description: "Conjurations spells last <mag>% longer for <dur> seconds.",
    baseCost: 0.25,
    baseMag: 5,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyDestruction = {
    name: 'Fortify Destruction',
    description: "Destruction spells are <mag>% stronger for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 5,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyEnchanting = {
    name: 'Fortify Enchanting',
    description: "For <dur> seconds, items are enchanted <mag>% stronger.",
    baseCost: 0.6,
    baseMag: 1,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyHealth = {
    name: 'Fortify Health',
    description: "Health is increased by <mag> points for <dur> seconds.",
    baseCost: 0.35,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyHeavyArmor = {
    name: 'Fortify Heavy Armor',
    description: "",
    baseCost: 0.5,
    baseMag: 2,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyIllusion = {
    name: 'Fortify Illusion',
    description: "Illusion spells are <mag>% stronger for <dur> seconds.",
    baseCost: 0.4,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyLightArmor = {
    name: 'Fortify Illusion Armor',
    description: "Increases Light Armor skill by <mag> points for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 2,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyLockpicking = {
    name: 'Fortify Lockpicking',
    description: "Lockpicking is <mag>% easier for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 2,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyMagicka = {
    name: 'Fortify Magicka',
    description: "Magicka is increased by <mag> points for <dur> seconds.",
    baseCost: 0.3,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyMarksman = {
    name: 'Fortify Marksman',
    description: "Magicka is increased by <mag> points for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyOneHanded = {
    name: 'Fortify One-handed',
    description: "One-handed weapons do <mag>% more damage for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyPickpocket = {
    name: 'Fortify Pickpocket',
    description: "Pickpocketing is <mag>% easier for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyRestoration = {
    name: 'Fortify Restoration',
    description: "Restoration spells are <mag>% stronger for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifySmithing = {
    name: 'Fortify Smithing',
    description: "For <dur> seconds, weapon and armor improving is <mag>% better.",
    baseCost: 0.75,
    baseMag: 4,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifySneak = {
    name: 'Fortify Sneak',
    description: "You are <mag>% harder to detect for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyStamina = {
    name: 'Fortify Stamina',
    description: "Stamina is increased by <mag> points for <dur> seconds.",
    baseCost: 0.3,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const fortifyTwoHanded = {
    name: 'Fortify Two-handed',
    description: "Two-handed weapons do <mag>% more damage for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const frenzy = {
    name: 'Frenzy',
    description: "Creatures and people up to level <mag> will attack anything nearby for <dur> seconds.",
    baseCost: 15,
    baseMag: 1,
    baseDur: 10,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const invisibility = {
    name: 'Invisibility',
    description: "Invisibility for <dur> seconds.",
    baseCost: 100,
    baseMag: 0,
    baseDur: 4,
    variableMagnitude: false,
    variableDuration: true,
    harmful: false
};

export const lingeringDamageHealth = {
    name: 'Lingering Damage Health',
    description: "Causes <mag> points of poison damage for <dur> seconds.",
    baseCost: 12,
    baseMag: 1,
    baseDur: 10,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const lingeringDamageMagicka = {
    name: 'Lingering Damage Magicka',
    description: "Drains the target's Magicka by <mag> points per second for <dur> seconds.",
    baseCost: 10,
    baseMag: 1,
    baseDur: 10,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const lingeringDamageStamina = {
    name: 'Lingering Damage Stamina',
    description: "Drain the target's Stamina by <mag> points per second for <dur> seconds.",
    baseCost: 1.8,
    baseMag: 1,
    baseDur: 10,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const paralysis = {
    name: 'Paralysis',
    description: "Target is paralyzed for <dur> seconds.",
    baseCost: 500,
    baseMag: 0,
    baseDur: 1,
    variableMagnitude: false,
    variableDuration: true,
    harmful: true
};

export const ravageHealth = {
    name: 'Ravage Health',
    description: "Causes <mag> points of concentrated poison damage.",
    baseCost: 0.4,
    baseMag: 2,
    baseDur: 10,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const ravageMagicka = {
    name: 'Ravage Magicka',
    description: "Concentrated poison damages maximum magicka by <mag> points.	",
    baseCost: 1,
    baseMag: 2,
    baseDur: 10,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const ravageStamina = {
    name: 'Ravage Stamina',
    description: "Concentrated poison damages maximum stamina by <mag> points.",
    baseCost: 1.6,
    baseMag: 2,
    baseDur: 10,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const regenerateHealth = {
    name: 'Regenerate Health',
    description: "Health regenerates <mag>% faster for <dur> seconds.",
    baseCost: 0.1,
    baseMag: 5,
    baseDur: 300,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const regenerateMagicka = {
    name: 'Regenerate Magicka',
    description: "Magicka regenerates <mag>% faster for <dur> seconds.",
    baseCost: 0.1,
    baseMag: 5,
    baseDur: 300,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const regenerateStamina = {
    name: 'Regenerate Stamina',
    description: "Stamina regenerates <mag>% faster for <dur> seconds.",
    baseCost: 0.1,
    baseMag: 5,
    baseDur: 300,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const resistFire = {
    name: 'Resist Fire',
    description: "Resist <mag>% of fire damage for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 3,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const resistFrost = {
    name: 'Resist Frost',
    description: "Resist <mag>% of frost damage for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 3,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const resistMagic = {
    name: 'Resist Magic',
    description: "Resist <mag>% of magic for <dur> seconds.",
    baseCost: 1,
    baseMag: 2,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const resistPoison = {
    name: 'Resist Poison',
    description: "Resist <mag>% of poison for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 4,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

export const resistShock = {
    name: 'Resist Shock',
    description: "Resist <mag>% of shock damage for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 3,
    baseDur: 60,
    variableMagnitude: true,
    variableDuration: false,
    harmful: false
};

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

export const slow = {
    name: 'Slow',
    description: "Target moves at 50% speed for <dur> seconds.",
    baseCost: 1,
    baseMag: 50,
    baseDur: 5,
    variableMagnitude: false,
    variableDuration: true,
    harmful: true
};

export const waterbreathing = {
    name: 'Waterbreathing',
    description: "Can breathe underwater for <dur> seconds.",
    baseCost: 30,
    baseMag: 0,
    baseDur: 5,
    variableMagnitude: false,
    variableDuration: true,
    harmful: false
};

export const weaknessToFire = {
    name: 'Weakness to Fire',
    description: "Target is <mag>% weaker to fire damage for <dur> seconds",
    baseCost: 0.6,
    baseMag: 3,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const weaknessToFrost = {
    name: 'Weakness to Frost',
    description: "Target is <mag>% weaker to frost damage for <dur> seconds.",
    baseCost: 0.5,
    baseMag: 3,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const weaknessToMagic = {
    name: 'Weakness to Magic',
    description: "Target is <mag>% weaker to magic for <dur> seconds.",
    baseCost: 1,
    baseMag: 2,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const weaknessToPoison = {
    name: 'Weakness to Poison',
    description: "Target is <mag>% weaker to poison for <dur> seconds.",
    baseCost: 1,
    baseMag: 2,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};

export const weaknessToShock = {
    name: 'Weakness to Shock',
    description: "Target is <mag>% weaker to shock damage for <dur> seconds.",
    baseCost: 0.7,
    baseMag: 3,
    baseDur: 30,
    variableMagnitude: true,
    variableDuration: false,
    harmful: true
};