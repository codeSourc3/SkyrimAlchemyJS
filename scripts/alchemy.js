import { restoreHealth, restoreStamina, restoreMagicka } from './effects.js';
import { Effect } from './ingredients.js';

function alchemistPerk(level = 0) {
    if (typeof level !== 'number') {
        throw new TypeError('Level must be a number');
    }
    switch (level) {
        case 5:
            return 100.0;
        case 4:
            return 80.0;
        case 3:
            return 60.0;
        case 2:
            return 40.0;
        case 1:
            return 20.0;
        default:
            return 0.0;
    }
}

/**
 * 
 * @param {Effect} effect the effect of the matching ingredients.
 * @param {boolean} hasPerk whether or not the user has the perk.
 */
function physicianPerk(effect, hasPerk = false) {
    const restorativeEffects = [
        restoreStamina.name,
        restoreHealth.name,
        restoreMagicka.name
    ];

    if (hasPerk && restorativeEffects.includes(effect.name)) {
        return 25;
    } else {
        return 0;
    }
}

function benefactorPerk(effect, hasPerk = false, isMakingPosion = false) {
    const isPotion = !isMakingPosion;
    const isBeneficial = !effect.harmful;
    if (hasPerk && isPotion && isBeneficial) {
        return 25.0;
    } else {
        return 0;
    }
}

function poisonerPerk(effect, hasPerk = false, isMakingPoison = false) {
    const isHarmful = effect.harmful;
    if (hasPerk && isMakingPoison && isHarmful) {
        return 25;
    } else {
        return 0;
    }
}

/**
 * 
 * @param {Effect} effect 
 * @param {number} alchemySkill 
 * @param {number} alchemistLevel 
 * @param {boolean} hasPhysicianPerk 
 * @param {boolean} hasBenefactorPerk 
 * @param {boolean} hasPoisonerPerk 
 * @param {boolean} isMakingPoison 
 * @param {number} fortifyAlchemy 
 * @returns {number}
 */
export function calcPowerFactor(effect, alchemySkill = 15, alchemistLevel = 0, hasPhysicianPerk = false, hasBenefactorPerk = false, hasPoisonerPerk = false, isMakingPoison = false, fortifyAlchemy = 0) {
    const ingredientMult = 4.0;
    const skillFactor = 1.5;
    const alchemistPerkValue = alchemistPerk(alchemistLevel);
    const physicianPerkValue = physicianPerk(effect, hasPhysicianPerk);
    const benefactorPerkValue = benefactorPerk(effect, hasBenefactorPerk, isMakingPoison);
    const poisonerPerkValue = poisonerPerk(effect, hasPoisonerPerk, isMakingPoison);
    return ingredientMult * 
    (1 + (skillFactor - 1) * alchemySkill / 100) * 
    (1 + fortifyAlchemy / 100) * 
    (1 + alchemistPerkValue / 100) * 
    (1 + physicianPerkValue / 100) * 
    (1 + benefactorPerkValue / 100 + poisonerPerkValue / 100);
}

/**
 * 
 * @param {Effect} effect 
 * @param {*} alchemySkill 
 * @param {*} alchemistLevel 
 * @param {*} hasPhysicianPerk 
 * @param {*} hasBenefactorPerk 
 * @param {*} hasPoisonerPerk 
 * @param {*} isMakingPoison 
 * @param {*} fortifyAlchemy 
 */
function calcMagnitudeDurationCost(effect, alchemySkill = 15, alchemistLevel = 0, hasPhysicianPerk = false, hasBenefactorPerk = false, hasPoisonerPerk = false, isMakingPoison = false, fortifyAlchemy = 0) {
    const powerFactor = calcPowerFactor(effect, alchemySkill, alchemistLevel, hasPhysicianPerk, hasBenefactorPerk, hasPoisonerPerk, isMakingPoison);
    let magnitude = effect.calculatedMagnitude;
    
}