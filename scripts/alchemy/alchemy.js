import { restoreHealth, restoreStamina, restoreMagicka } from './effects.js';
import { Effect, Ingredient } from './ingredients.js';
import { logger as console } from '../infrastructure/logger.js';

/**
 * @typedef Potion
 * @property {string} name - The name of the potion.
 * @property {boolean} didSucceed - Whether or not the potion succeeded.
 * @property {string} effects - The description of the potion.
 * @property {number} gold - The gold cost of the potion.
 */

export const MAX_CHOSEN_INGREDIENTS = 3;
export const MIN_CHOSEN_INGREDIENTS = 2;

/**
 * 
 * @param {number} level - An integer between 0 and 5. Defaults to 0.
 * @returns {number}
 */
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

/**
 * 
 * @param {Effect} effect - The effect to apply the multiplier on.
 * @param {boolean} hasPerk - Whether the player has the perk.
 * @param {boolean} isMakingPosion - This is decided based on the potion effect with the highest cost.
 * @returns {number} - Returns 25.0 if player has the perk, the effect isn't harmful and is making poison 
 * - Returns 0 in all other cases.
 */
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
    console.debug(effect instanceof Effect);
    console.debug('Base Cost: ', effect.cost);
    let goldValue = Math.floor(effect.cost.baseCost * (magnitudeFactor * durationFactor) ** 1.1);
    console.debug(`Magnitude: ${magnitude}, Duration: ${duration}, Gold Value: ${goldValue}`);
    return {
        name: effect.name,
        description: effect.description,
        magnitude: magnitude,
        duration: duration,
        value: goldValue
    };
}

/**
 * Finds the effect with the highest cost.
 * 
 * @param {Effect[]} effects 
 * @returns {Effect}
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
 * @returns {(effects: Effect[]) => Potion}
 */
export function createPotionBuilder(alchemySkill = 15, alchemistLevel = 0, hasPhysicianPerk = false, hasBenefactorPerk = false, hasPoisonerPerk = false, fortifyAlchemy = 0) {
    return function (effects) {
        console.assert(Array.isArray(effects), 'Effects is not an array');
        if (effects.length === 0) return {name: 'Potion Failed', didSucceed: false};
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
            console.info('Effect description', effect.description);
        });
        let totalGoldCost = potionEffects.map(effect => effect.value).reduce((prev, curr) => {
            return prev + curr;
        }, 0);

        return {
            name: potionName,
            effects: potionEffects.map(effect => effect.description).join(', '),
            gold: totalGoldCost,
            didSucceed: true
        };
    }
}

/**
 * @template T
 */
class Pair {
    /**
     * 
     * @param {T} first 
     * @param {T} second 
     */
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }

    toArray() {
        return [this.first, this.second];
    }

    equals(object, predicate) {
        if (object instanceof Pair) return false;
        if (this !== object) return false;
        if (!predicate(this.first, object.first) || !predicate(this.first, object.second)) return false;
        if (!predicate(this.second, object.first) || !predicate(this.second, object.second)) return false;
        return true;
    }

    toString() {
        return `${this.first}, ${this.second}`;
    }
}

const ingredientEffectCache = new Map();

/**
 * Finds all possible ingredient combinations. Only handles 3 ingredients right now.
 * @param {Ingredient[]} ingredients 
 * @returns {Map<string, Effect[]>}
 */
export function findPossibleCombinations(ingredients) {
    const recipes = new Map();
    if (ingredients.length > 3) throw new Error('This method only works with up to 3 ingredients.');
    // Can't have the same effect more than once!
    // Find all pairs that share an effect.
    const [first, second, third, ...theRest] = ingredients;
    if (ingredients.length === 3) {
        const effects = first.mixThree(second, third);
        recipes.set(hashDynamic(ingredients), effects);
        const match2 = second.mixTwo(third);
        const match3 = third.mixTwo(first);
        if (match2.length > 0) recipes.set(hashStatic(second, third), match2);
        if (match3.length > 0) recipes.set(hashStatic(third, first), match3);
    }

    const match1 = first.mixTwo(second);
    
    if (match1.length > 0) recipes.set(hashStatic(first, second), match1);
    

    return recipes;
}




/**
 * 
 * @param  {Ingredient[]} ingredients 
 * @returns {string}
 */
function hashDynamic(ingredients) {
    return ingredients.map(String).sort().join();
}

function hashStatic(...elements) {
    return elements.map(String).sort().join();
}


