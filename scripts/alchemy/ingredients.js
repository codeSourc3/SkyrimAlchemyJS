// Parse ingredients.json

export async function parseIngredientsJSON(url='../data/ingredients.json') {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}
export class Effect {
    
    /**
     * 
     * @param {{name: string, description: string, cost: {baseCost: number, multiplier: number}, magnitude: {baseMag: number, multiplier: number}, duration: {baseDur: number, multiplier: number}, variableMagnitude: number, variableDuration: number, harmful: boolean}} param0 
     */
    constructor({name, description, cost, magnitude, duration, variableMagnitude, variableDuration, harmful}) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.magnitude = magnitude;
        this.duration = duration;
        this.variableMagnitude = variableMagnitude;
        this.variableDuration = variableDuration
        this.harmful = harmful;
    }

    get calculatedMagnitude() {
        return this.magnitude.baseMag * this.magnitude.multiplier;
    }

    get calculatedCost() {
        return this.cost.baseCost * this.cost.multiplier;
    }

    get calculatedDuration() {
        return this.duration.baseDur * this.duration.multiplier;
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
        this.effects = Array.from(effects).map( effect => new Effect(effect));
        this.effectNames = this.effects.map(effect => effect.name);
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
                let thisMag = thisEffect.calculatedMagnitude;
                let otherMag = otherEffect.calculatedMagnitude;

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
        let results = [...thisAndSecondEffects, ...thisAndThirdMatches, ...secondAndThirdMatches];
        // filter out all but the strongest matches.
        const calcMagnitude = effect => {
            return effect.calculatedMagnitude;
        };

        const effectMap = new Map();
        for (const effect of results) {
            if (!effectMap.has(effect.name) || calcMagnitude(effect) > calcMagnitude(effectMap.get(effect.name))) {
                effectMap.set(effect.name, effect);
            }
        }
        return Array.from(effectMap.values());
        
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

