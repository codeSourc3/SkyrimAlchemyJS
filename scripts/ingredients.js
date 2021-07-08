// Parse ingredients.json

export async function parseIngredientsJSON(url='../data/ingredients.json') {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}
export class Effect {
    constructor({name, description, cost, magnitude, duration, variableMagnitude, variableDuration}) {
        this.name = name;
        this.description = description;
        /**
         * @type {{baseCost: number, multiplier: number}}
         */
        this.cost = cost;
        /**
         * @type {{baseMag: number, multiplier: number}}
         */
        this.magnitude = magnitude;
        /**
         * @type {{baseDur: number, multiplier: number}}
         */
        this.duration = duration;
        this.variableMagnitude = variableMagnitude;
        this.variableDuration = variableDuration
    }
}


export class Ingredient {
    /**
     * 
     * @param {{name: string, goldValue: number, weight: number, dlc: string, effects: Effect[]}} object 
     */
    constructor({name, goldValue, weight, dlc, effects}) {
        this.name = name;
        this.goldValue = goldValue;
        this.weight = weight;
        this.dlc = dlc;
        this.effects = Array.from(effects);
    }

    get first() {
        return this.effects[0];
    }

    get second() {
        return this.effects[1];
    }

    get third() {
        return this.effects[2];
    }

    get fourth() {
        return this.effects[3];
    }

    /**
     * Filters out matching effects. Only keeps the strongest of each match.
     * @param {Ingredient} otherIngredient 
     */
    mixTwo(otherIngredient) {
        const otherEffects = otherIngredient.effects;
        let matchingEffects = [];

        for (const thisEffect of this.effects) {
            if (otherIngredient.hasEffect(thisEffect)) {
                const otherEffect = otherEffects.find(effect => effect.name === thisEffect.name);
                // other ingredient has this effect.
                let thisMag = thisEffect.magnitude.baseMag * thisEffect.magnitude.multiplier;
                let otherMag = otherEffect.magnitude.baseMag * otherEffect.magnitude.multiplier;

                if (thisMag > otherMag) {
                    matchingEffects.push(thisEffect);
                } else {
                    matchingEffects.push(otherEffect);
                }
            }
        }
        return matchingEffects;
    }

    /**
     * 
     * @param {Ingredient} ingredientTwo 
     * @param {Ingredient} ingredientThree 
     */
    mixThree(ingredientTwo, ingredientThree) {
        const thisAndSecondEffects = this.mixTwo(ingredientTwo);
        const thisAndThirdMatches = this.mixTwo(ingredientThree);
        const secondAndThirdMatches = ingredientTwo.mixTwo(ingredientThree);
        const results = [...thisAndSecondEffects, ...thisAndThirdMatches, ...secondAndThirdMatches];
        return results;
        
    }

    /**
     * 
     * @param {Effect} otherEffect 
     * @returns {boolean}
     */
    hasEffect(otherEffect) {
        let effectNames = this.effects.map(effect => effect.name);
        return effectNames.includes(otherEffect.name);
    }
}

