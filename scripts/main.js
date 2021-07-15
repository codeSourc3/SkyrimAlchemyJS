import { parseIngredientsJSON, Ingredient } from './ingredients.js';

let ingredientObject;
parseIngredientsJSON().then(ingredients => {
    ingredientObject = ingredients;
}).then(() => {
    const riverBetty = new Ingredient(ingredientObject.riverBetty);
    const poisonBloom = new Ingredient(ingredientObject.poisonBloom);
    const tramaRoot = new Ingredient(ingredientObject.tramaRoot);
    console.log(riverBetty.mixThree(poisonBloom, tramaRoot));
});