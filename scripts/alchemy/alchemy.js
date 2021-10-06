import { restoreHealth, restoreStamina, restoreMagicka } from './effects.js';
import { Effect } from './ingredients.js';

export const MAX_CHOSEN_INGREDIENTS = 3;
export const MIN_CHOSEN_INGREDIENTS = 2;

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
function calcPowerFactor(effect, alchemySkill = 15, alchemistLevel = 0, hasPhysicianPerk = false, hasBenefactorPerk = false, hasPoisonerPerk = false, isMakingPoison = false, fortifyAlchemy = 0) {
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
 * @param {number} alchemySkill 
 * @param {number} alchemistLevel 
 * @param {boolean} hasPhysicianPerk 
 * @param {boolean} hasBenefactorPerk 
 * @param {boolean} hasPoisonerPerk 
 * @param {boolean} isMakingPoison 
 * @param {number} fortifyAlchemy 
 */
function calcMagnitudeDurationCost(effect, alchemySkill = 15, alchemistLevel = 0, hasPhysicianPerk = false, hasBenefactorPerk = false, hasPoisonerPerk = false, isMakingPoison = false, fortifyAlchemy = 0) {
    const powerFactor = calcPowerFactor(effect, alchemySkill, alchemistLevel, hasPhysicianPerk, hasBenefactorPerk, hasPoisonerPerk, isMakingPoison);
    let magnitude = effect.calculatedMagnitude;
    // HACK: Don't have NoMagnitude flag.
    if (magnitude <= 0 && !effect.variableMagnitude) {
        magnitude = 0;
    }
    let magnitudeFactor = 1;
    if (effect.variableMagnitude) {
        magnitudeFactor = powerFactor;
    }
    magnitude = Math.round(magnitude * magnitudeFactor);

    let duration = effect.calculatedDuration;
    // HACK: Don't have NoDuration flag.
    if (duration < 0) duration = 0;
    let durationFactor = (effect.variableDuration) ? powerFactor : 1;
    duration = Math.round(duration * durationFactor);

    magnitudeFactor = 1;
    if (magnitude > 0) magnitudeFactor = magnitude;
    durationFactor = 1;
    if (duration > 0) durationFactor = duration / 10;
    console.log(effect instanceof Effect);
    console.log('Base Cost: ', effect.cost);
    let goldValue = Math.floor(effect.cost.baseCost * (magnitudeFactor * durationFactor) ** 1.1);
    console.log(`Magnitude: ${magnitude}, Duration: ${duration}, Gold Value: ${goldValue}`);
    return {
        name: effect.name,
        description: effect.description,
        magnitude: magnitude,
        duration: duration,
        value: goldValue
    };
}

/**
 * 
 * @param {Effect[]} effects 
 */
function findStrongestEffect(effects) {
    let strongest = effects[0];
    for (const effect of effects) {
        let currrentCost = effect.calculatedCost;
        let strongestCost = strongest.calculatedCost;
        if (currrentCost > strongestCost) {
            strongest = effect;
        }
    }
    return strongest;
}

/**
 * 
 * @param {Effect[]} effects 
 * @param {number} alchemySkill 
 * @param {number} alchemistLevel 
 * @param {boolean} hasPhysicianPerk 
 * @param {boolean} hasBenefactorPerk 
 * @param {boolean} hasPoisonerPerk 
 * @param {number} fortifyAlchemy 
 */
export function makePotion(alchemySkill = 15, alchemistLevel = 0, hasPhysicianPerk = false, hasBenefactorPerk = false, hasPoisonerPerk = false, fortifyAlchemy = 0) {
    return function (effects) {
        console.assert(Array.isArray(effects));
        const primaryEffect = findStrongestEffect(effects);
        let isMakingPoison = primaryEffect.harmful;
        let potionName = isMakingPoison ? 'Poison of ' : 'Potion of ';
        potionName += primaryEffect.name;
        let potionEffects = effects.map(effect => {
            return calcMagnitudeDurationCost(effect, alchemySkill, alchemistLevel, hasPhysicianPerk, hasBenefactorPerk, hasPoisonerPerk, isMakingPoison, fortifyAlchemy);
        });
        potionEffects.forEach((effect) => {
            if (effect.description.includes('<mag>')) {
                effect.description = effect.description.replace('<mag>', String(effect.magnitude));
            }
            if (effect.description.includes('<dur>')) {
                effect.description = effect.description.replace('<dur>', String(effect.duration));
            }
            effect.description = effect.description.replace('.', '');
            console.info(effect.description);
        });
        let totalGoldCost = potionEffects.map(effect => effect.value).reduce((prev, curr) => {
            return prev + curr;
        }, 0);

        return {
            name: potionName,
            effects: potionEffects.map(effect => effect.description).join(', '),
            gold: totalGoldCost
        };
    }
}
