import { calcMagnitudeDurationCost, findStrongestEffect, calcPowerFactor } from './alchemy.js';
import { parseIngredientsJSON, Ingredient } from './ingredients.js';

let ingredientObject;
parseIngredientsJSON().then(ingredients => {
    ingredientObject = ingredients;
}).then(() => {
    const riverBetty = new Ingredient(ingredientObject.riverBetty);
    const poisonBloom = new Ingredient(ingredientObject.poisonBloom);
    const tramaRoot = new Ingredient(ingredientObject.tramaRoot);
    let effects = riverBetty.mixThree(poisonBloom, tramaRoot);

    console.log('Ancestor Moth Wing + Bear Claws');
    const ancestorMothWing = new Ingredient(ingredientObject.ancestorMothWing);
    const bearClaws = new Ingredient(ingredientObject.bearClaws);
    let effect = ancestorMothWing.mixTwo(bearClaws)[0];
    console.log('Should be Damage Magicka Regen: ', effect);
    const skill = 75;
    const alchemistPerkLevel = 3;
    const {magnitude, duration, value} = calcMagnitudeDurationCost(effect, skill, alchemistPerkLevel, true, true, false, true);
    
    const hangingMoss = new Ingredient(ingredientObject.hangingMoss);
    let dmgMagickaRegen = hangingMoss.mixTwo(bearClaws);
    let strongestEffect = findStrongestEffect(dmgMagickaRegen);
    console.log('Should be Magicka Regen: ', strongestEffect.name);
});