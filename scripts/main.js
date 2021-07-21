import { makePotion } from './alchemy.js';
import { parseIngredientsJSON, Ingredient } from './ingredients.js';

let ingredientObject;
parseIngredientsJSON().then(ingredients => {
    ingredientObject = ingredients;
}).then(() => {
    const riverBetty = new Ingredient(ingredientObject.riverBetty);
    const poisonBloom = new Ingredient(ingredientObject.poisonBloom);
    const tramaRoot = new Ingredient(ingredientObject.tramaRoot);
    let skill = 75;
    let alchemistPerkLevel = 3;
    let hasPhysicianPerk = true;
    let hasBenefactorPerk = true;
    let hasPoisonerPerk = true;
    let fortifyAlchemy = 0;
    let effects = riverBetty.mixThree(poisonBloom, tramaRoot);
    let potionMaker = makePotion(skill, alchemistPerkLevel, hasPhysicianPerk, hasBenefactorPerk, hasPoisonerPerk, fortifyAlchemy);
    let potion = potionMaker(effects);
    console.table(potion, 'name', 'effects', 'gold');
});