import assert from 'assert';
import { describe, it, before, beforeEach } from 'mocha';

import {Ingredient} from '../public/scripts/alchemy/ingredients.js';
import should from 'should';

describe('Ingredient', () => {
    // mixing them will get no effect.
    /** @type {Ingredient} */
    let abaceanLongfin;
    /** @type {Ingredient} */
    let ancestorMothWing;
    // Mixing Charred Skeever Hide with Hawk Feathers will get the Cure Disease effect.
    /** @type {Ingredient} */
    let charredSkeeverHide;
    /** @type {Ingredient} */
    let hawkFeathers;
    // Mixing Charred Skeever Hide with Felsaad Tern Feathers will get the Cure Disease and Restore Health effect.
    /*
    Mixing Charred Skeever Hide with Hawk Feathers and Felsaad Tern Feathers will
    get Cure Disease, Restore Health, and Fortify Light Armor.
     */
    /** @type {Ingredient} */
    let felsaadTernFeathers;

    before(() => {
        abaceanLongfin = new Ingredient({
            "name": "Abecean Longfin",
            "goldValue": 15,
            "weight": 0.5,
            "dlc": "Vanilla",
            "effects": [
                {
                    "name": "Weakness to Frost",
                    "description": "Target is <mag>% weaker to frost damage for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 3,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 30,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": true
                },
                {
                    "name": "Fortify Sneak",
                    "description": "You are <mag>% harder to detect for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 4,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Weakness to Poison",
                    "description": "Target is <mag>% weaker to poison for <dur> seconds.",
                    "cost": {
                        "baseCost": 1,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 2,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 30,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": true
                },
                {
                    "name": "Fortify Restoration",
                    "description": "Restoration spells are <mag>% stronger for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 4,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                }
            ]
        });

        ancestorMothWing = new Ingredient({
            "name": "Ancestor Moth Wing",
            "goldValue": 2,
            "weight": 0.1,
            "dlc": "Dawnguard",
            "effects": [
                {
                    "name": "Damage Stamina",
                    "description": "Drain the target's Stamina by <mag> points.",
                    "cost": {
                        "baseCost": 1.8,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 3,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 0,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": true
                },
                {
                    "name": "Fortify Conjuration",
                    "description": "Conjurations spells last <mag>% longer for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.25,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 5,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Damage Magicka Regen",
                    "description": "Decrease the target's Magicka regeneration by <mag>% for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 100,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 5,
                        "multiplier": 1
                    },
                    "variableMagnitude": false,
                    "variableDuration": true,
                    "harmful": true
                },
                {
                    "name": "Fortify Enchanting",
                    "description": "For <dur> seconds, items are enchanted <mag>% stronger.",
                    "cost": {
                        "baseCost": 0.6,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 1,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 30,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                }
            ]
        });

        charredSkeeverHide = new Ingredient({
            "name": "Charred Skeever Hide",
            "goldValue": 1,
            "weight": 0.5,
            "dlc": "Vanilla",
            "effects": [
                {
                    "name": "Restore Stamina",
                    "description": "Restore <mag> Stamina.",
                    "cost": {
                        "baseCost": 0.6,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 5,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 0,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Cure Disease",
                    "description": "Cures all diseases.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 0.36
                    },
                    "magnitude": {
                        "baseMag": 5,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 0,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Resist Poison",
                    "description": "Resist <mag>% of poison for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 4,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Restore Health",
                    "description": "Restore <mag> points of Health.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 5,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 0,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                }
            ]
        });

        // Hawk Feathers
        hawkFeathers = new Ingredient({
            "name": "Hawk Feathers",
            "goldValue": 15,
            "weight": 0.1,
            "dlc": "Vanilla",
            "effects": [
                {
                    "name": "Cure Disease",
                    "description": "Cures all diseases.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 0.36
                    },
                    "magnitude": {
                        "baseMag": 5,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 0,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Fortify Light Armor",
                    "description": "Increases Light Armor skill by <mag> points for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 2,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Fortify One-handed",
                    "description": "One-handed weapons do <mag>% more damage for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 4,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Fortify Sneak",
                    "description": "You are <mag>% harder to detect for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 4,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                }
            ]
        });

        felsaadTernFeathers = new Ingredient({
            "name": "Felsaad Tern Feathers",
            "goldValue": 50,
            "weight": 0.25,
            "dlc": "Dragonborn",
            "effects": [
                {
                    "name": "Restore Health",
                    "description": "Restore <mag> points of Health.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 5,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 0,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Fortify Light Armor",
                    "description": "Increases Light Armor skill by <mag> points for <dur> seconds.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 2,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Cure Disease",
                    "description": "Cures all diseases.",
                    "cost": {
                        "baseCost": 0.5,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 5,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 0,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                },
                {
                    "name": "Resist Magic",
                    "description": "Resist <mag>% of magic for <dur> seconds.",
                    "cost": {
                        "baseCost": 1,
                        "multiplier": 1
                    },
                    "magnitude": {
                        "baseMag": 2,
                        "multiplier": 1
                    },
                    "duration": {
                        "baseDur": 60,
                        "multiplier": 1
                    },
                    "variableMagnitude": true,
                    "variableDuration": false,
                    "harmful": false
                }
            ]
        });
    })

    describe('#mixTwo()', () => {
        // Testing Ingredient#mixTwo()
        it('should return empty array if no matching effects found', () => {
            should(abaceanLongfin.mixTwo(ancestorMothWing)).Array().and.length(0);
        });
    });;

});