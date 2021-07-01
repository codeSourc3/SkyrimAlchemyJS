import * as effects from './effects.js';

/**
 * 
 * @param {effects.Effect} effect 
 * @param {number} magMultiplier 
 * @param {number} durMultiplier 
 * @param {number} costMultiplier 
 * @returns {IngredientEffect}
 */
function toIngredientEffect(effect, magMultiplier = 1, durMultiplier = 1, costMultiplier = 1) {
    const { name, description, baseCost, baseMag, baseDur, variableMagnitude, variableDuration, harmful } = effect;
    return {
        name,
        description,
        cost: {
            baseCost,
            multiplier: costMultiplier,
        },
        magnitude: {
            baseMag,
            multiplier: magMultiplier
        },
        duration: {
            baseDur,
            multiplier: durMultiplier
        },
        variableMagnitude,
        variableDuration
    };
}

/**
 * @typedef IngredientEffect
 * @property {string} name
 * @property {string} description
 * @property {{baseCost: number, multiplier: number}} cost
 * @property {{baseMag: number, multiplier: number}} magnitude
 * @property {{baseDur: number, multiplier: number}} duration
 * @property {boolean} variableMagnitude
 * @property {boolean} variableDuration
 */

export const Dlc = {
    Vanilla: 'Vanilla',
    DG: 'Dawnguard',
    HF: 'Hearthfire',
    DB: 'Dragonborn'
};

export const abeceanLongfin = {
    name: 'Abecean Longfin',
    goldValue: 15,
    weight: 0.5,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.weaknessToFrost),
        toIngredientEffect(effects.fortifySneak),
        toIngredientEffect(effects.weaknessToPoison),
        toIngredientEffect(effects.fortifyRestoration)
    ]
};

export const ancestorMothWing = {
    name: 'Ancestor Moth Wing',
    goldValue: 2,
    weight: 0.1,
    dlc: Dlc.DG,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.fortifyConjuration),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.fortifyEnchanting)
    ]
};

export const ashCreepCluster = {
    name: 'Ash Creep Cluster',
    goldValue: 20,
    weight: 0.25,
    dlc: Dlc.DB,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.invisibility),
        toIngredientEffect(effects.resistFire),
        toIngredientEffect(effects.fortifyDestruction)
    ]
};

export const ashHopperJelly = {
    name: 'Ash Hopper Jelly',
    goldValue: 20,
    weight: 0.25,
    dlc: Dlc.DB,
    effects: [
        toIngredientEffect(effects.restoreHealth),
        toIngredientEffect(effects.fortifyLightArmor),
        toIngredientEffect(effects.resistShock),
        toIngredientEffect(effects.weaknessToFrost)
    ]
};

export const ashenGrassPod = {
    name: 'Ashen Grass Pod',
    goldValue: 1,
    weight: 0.1,
    dlc: Dlc.DB,
    effects: [
        toIngredientEffect(effects.resistFire, 1.33, 1, 1.36),
        toIngredientEffect(effects.weaknessToShock),
        toIngredientEffect(effects.fortifyLockpicking),
        toIngredientEffect(effects.fortifySneak)
    ]
};

export const bearClaws = {
    name: 'Bear Claws',
    goldValue: 2,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreStamina, 0.8, 1, 0.78),
        toIngredientEffect(effects.fortifyHealth),
        toIngredientEffect(effects.fortifyOneHanded),
        toIngredientEffect(effects.damageMagickaRegen)
    ]
};

export const bee = {
    name: 'Bee',
    goldValue: 3,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreStamina),
        toIngredientEffect(effects.ravageStamina),
        toIngredientEffect(effects.regenerateStamina),
        toIngredientEffect(effects.weaknessToShock)
    ]
};

export const beehiveHusk = {
    name: 'Beehive Husk',
    goldValue: 5,
    weight: 1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistPoison, 0.5),
        toIngredientEffect(effects.fortifyLightArmor),
        toIngredientEffect(effects.fortifySneak),
        toIngredientEffect(effects.fortifyDestruction)
    ]
};

export const bleedingCrown = {
    name: 'Bleeding Crown',
    goldValue: 10,
    weight: 0.3,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.weaknessToFire),
        toIngredientEffect(effects.fortifyBlock),
        toIngredientEffect(effects.weaknessToPoison),
        toIngredientEffect(effects.resistMagic)
    ]
};

export const blisterwort = {
    name: 'Blisterwort',
    goldValue: 12,
    weight: 0.2,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.frenzy),
        toIngredientEffect(effects.restoreHealth, 0.6, 1, 0.57),
        toIngredientEffect(effects.fortifySmithing)
    ]
};

export const blueButterflyWing = {
    name: 'Blue Butterfly Wing',
    goldValue: 2,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.fortifyConjuration),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.fortifyEnchanting)
    ]
};

export const blueDartwing = {
    name: 'Blue Dartwing',
    goldValue: 1,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistShock),
        toIngredientEffect(effects.fortifyPickpocket),
        toIngredientEffect(effects.restoreHealth),
        toIngredientEffect(effects.fear)
    ]
};

export const blueMountainFlower = {
    name: 'Blue Mountain Flower',
    goldValue: 2,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreHealth),
        toIngredientEffect(effects.fortifyConjuration),
        toIngredientEffect(effects.fortifyHealth),
        toIngredientEffect(effects.damageMagickaRegen)
    ]
};

export const boarTusk = {
    name: 'Boar Tusk',
    goldValue: 20,
    weight: 0.5,
    dlc: Dlc.DB,
    effects: [
        toIngredientEffect(effects.fortifyStamina, 1.25, 5, 7.5),
        toIngredientEffect(effects.fortifyHealth, 1, 5, 5.9),
        toIngredientEffect(effects.fortifyBlock),
        toIngredientEffect(effects.frenzy)
    ]
};

export const boneMeal = {
    name: 'Bone Meal',
    goldValue: 5,
    weight: 0.5,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.resistFire),
        toIngredientEffect(effects.fortifyConjuration),
        toIngredientEffect(effects.ravageStamina)
    ]
};

export const briarHeart = {
    name: 'Briar Heart',
    goldValue: 20,
    weight: 0.5,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreMagicka),
        toIngredientEffect(effects.fortifyBlock, 0.5),
        toIngredientEffect(effects.paralysis),
        toIngredientEffect(effects.fortifyMagicka)
    ]
};

export const burntSprigganWood = {
    name: 'Burnt Spriggan Wood',
    goldValue: 20,
    weight: 0.5,
    dlc: Dlc.DB,
    effects: [
        toIngredientEffect(effects.weaknessToFire),
        toIngredientEffect(effects.fortifyAlteration),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.slow)
    ]
};

export const butterflyWing = {
    name: 'Butterfly Wing',
    goldValue: 3,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreHealth),
        toIngredientEffect(effects.fortifyBarter),
        toIngredientEffect(effects.lingeringDamageStamina),
        toIngredientEffect(effects.damageMagicka)
    ]
};

export const canisRoot = {
    name: 'Canis Root',
    goldValue: 5,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.fortifyOneHanded),
        toIngredientEffect(effects.fortifyMarksman),
        toIngredientEffect(effects.paralysis)
    ]
};

export const charredSkeeverHide = {
    name: 'Charred Skeever Hide',
    goldValue: 1,
    weight: 0.5,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreStamina),
        toIngredientEffect(effects.cureDisease, 1, 1, 0.36),
        toIngredientEffect(effects.resistPoison),
        toIngredientEffect(effects.restoreHealth)
    ]
};

export const chaurusEggs = {
    name: 'Chaurus Eggs',
    goldValue: 10,
    weight: 0.2,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.weaknessToPoison),
        toIngredientEffect(effects.fortifyStamina),
        toIngredientEffect(effects.damageMagicka),
        toIngredientEffect(effects.invisibility)
    ]
};

export const chaurusHunterAntennae = {
    name: 'Chaurus Hunter Antennae',
    goldValue: 2,
    weight: 0.1,
    dlc: Dlc.DG,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.fortifyConjuration),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.fortifyEnchanting)
    ]
};

export const chickenEgg = {
    name: "Chicken's Egg",
    goldValue: 2,
    weight: 0.5,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistMagic),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.waterbreathing),
        toIngredientEffect(effects.lingeringDamageStamina)
    ]
};

export const creepCluster = {
    name: 'Creep Cluster',
    goldValue: 10,
    weight: 0.2,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreMagicka),
        toIngredientEffect(effects.damageStaminaRegen),
        toIngredientEffect(effects.fortifyCarryWeight),
        toIngredientEffect(effects.weaknessToMagic)
    ]
};

export const crimsonNirnroot = {
    name: 'Crimson Nirnroot',
    goldValue: 10,
    weight: 0.2,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageHealth, 3),
        toIngredientEffect(effects.damageStamina, 3),
        toIngredientEffect(effects.invisibility),
        toIngredientEffect(effects.resistMagic)
    ]
};

export const cyrodilicSpadetail = {
    name: 'Cyrodilic Spadetail',
    goldValue: 15,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.fortifyRestoration),
        toIngredientEffect(effects.fear),
        toIngredientEffect(effects.ravageHealth)
    ]
};

export const daedraHeart = {
    name: 'Daedra Heart',
    goldValue: 250,
    weight: 0.5,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreHealth),
        toIngredientEffect(effects.damageStaminaRegen),
        toIngredientEffect(effects.damageMagicka),
        toIngredientEffect(effects.fear)
    ]
};

export const deathbell = {
    name: 'Deathbell',
    goldValue: 4,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageHealth, 1.5),
        toIngredientEffect(effects.ravageStamina, 1, 1, 2.1),
        toIngredientEffect(effects.slow),
        toIngredientEffect(effects.weaknessToPoison)
    ]
};

export const dragonsTongue = {
    name: "Dragon's Tongue",
    goldValue: 5,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistFire),
        toIngredientEffect(effects.fortifyBarter),
        toIngredientEffect(effects.fortifyIllusion),
        toIngredientEffect(effects.fortifyTwoHanded)
    ]
};

export const dwarvenOil = {
    name: 'Dwarven Oil',
    goldValue: 15,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.weaknessToMagic),
        toIngredientEffect(effects.fortifyIllusion),
        toIngredientEffect(effects.regenerateMagicka),
        toIngredientEffect(effects.restoreMagicka)
    ]
};

export const ectoplasm = {
    name: 'Ectoplasm',
    goldValue: 25,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreMagicka),
        toIngredientEffect(effects.fortifyDestruction, 0.8),
        toIngredientEffect(effects.fortifyMagicka),
        toIngredientEffect(effects.damageHealth)
    ]
};

export const elvesEar = {
    name: 'Elves Ear',
    goldValue: 10,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreMagicka),
        toIngredientEffect(effects.fortifyMarksman),
        toIngredientEffect(effects.weaknessToFrost),
        toIngredientEffect(effects.resistFire)
    ]
};

export const emperorParasolMoss = {
    name: 'Emperor Parasol Moss',
    goldValue: 1,
    weight: 0.25,
    dlc: Dlc.DB,
    effects: [
        toIngredientEffect(effects.damageHealth),
        toIngredientEffect(effects.fortifyMagicka),
        toIngredientEffect(effects.regenerateHealth),
        toIngredientEffect(effects.fortifyTwoHanded)
    ]
};

export const eyeOfSabreCat = {
    name: 'Eye of Sabre Cat',
    goldValue: 2,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageHealth),
        toIngredientEffect(effects.fortifyMagicka),
        toIngredientEffect(effects.regenerateHealth),
        toIngredientEffect(effects.fortifyTwoHanded)
    ]
};

export const falmerEar = {
    name: 'Falmer Ear',
    goldValue: 10,
    weight: 0.2,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageHealth),
        toIngredientEffect(effects.frenzy),
        toIngredientEffect(effects.resistPoison),
        toIngredientEffect(effects.fortifyLockpicking)
    ]
};

export const felsaadTernFeathers = {
    name: 'Felsaad Tern Feathers',
    goldValue: 50,
    weight: 0.25,
    dlc: Dlc.DB,
    effects: [
        toIngredientEffect(effects.restoreHealth),
        toIngredientEffect(effects.fortifyLightArmor),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.resistMagic)
    ]
};

export const fireSalts = {
    name: 'Fire Salts',
    goldValue: 50,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.weaknessToFrost),
        toIngredientEffect(effects.resistFire),
        toIngredientEffect(effects.restoreMagicka),
        toIngredientEffect(effects.regenerateMagicka)
    ]
};

export const flyAmanita = {
    name: 'Fly Amanita',
    goldValue: 2,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistFire),
        toIngredientEffect(effects.fortifyTwoHanded),
        toIngredientEffect(effects.frenzy),
        toIngredientEffect(effects.regenerateStamina)
    ]
};

export const frostMirriam = {
    name: 'Frost Mirriam',
    goldValue: 1,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistFrost),
        toIngredientEffect(effects.fortifySneak),
        toIngredientEffect(effects.ravageMagicka),
        toIngredientEffect(effects.damageStaminaRegen)
    ]
};

export const frostSalts = {
    name: 'Frost Salts',
    goldValue: 100,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.weaknessToFire),
        toIngredientEffect(effects.resistFrost),
        toIngredientEffect(effects.restoreMagicka),
        toIngredientEffect(effects.fortifyConjuration)
    ]
};

export const garlic = {
    name: 'Garlic',
    goldValue: 1,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistPoison),
        toIngredientEffect(effects.fortifyStamina),
        toIngredientEffect(effects.regenerateMagicka),
        toIngredientEffect(effects.regenerateHealth)
    ]
};

export const giantLichen = {
    name: 'Giant Lichen',
    goldValue: 5,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.weaknessToShock),
        toIngredientEffect(effects.ravageHealth),
        toIngredientEffect(effects.weaknessToPoison),
        toIngredientEffect(effects.restoreMagicka)
    ]
};

export const giantsToe = {
    name: "Giant's Toe",
    goldValue: 20,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.damageStamina),
        toIngredientEffect(effects.fortifyHealth, 1, 5, 5.9),
        toIngredientEffect(effects.fortifyCarryWeight),
        toIngredientEffect(effects.damageStaminaRegen)
    ]
};

export const gleamBlossom = {
    name: 'Gleamblossom',
    goldValue: 5,
    weight: 0.1,
    effects: [
        toIngredientEffect(effects.resistMagic),
        toIngredientEffect(effects.fear),
        toIngredientEffect(effects.regenerateHealth),
        toIngredientEffect(effects.paralysis)
    ]
};

export const glowDust = {
    name: 'Glow Dust',
    goldValue: 20,
    weight: 0.5,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageMagicka),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.fortifyDestruction),
        toIngredientEffect(effects.resistShock)
    ]
};

export const glowingMushroom = {
    name: 'Glowing Mushroom',
    goldValue: 5,
    weight: 0.2,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistShock),
        toIngredientEffect(effects.fortifyDestruction),
        toIngredientEffect(effects.fortifySmithing),
        toIngredientEffect(effects.fortifyHealth)
    ]
};

export const grassPod = {
    name: 'Grass Pod',
    goldValue: 1,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistPoison),
        toIngredientEffect(effects.ravageMagicka),
        toIngredientEffect(effects.fortifyAlteration),
        toIngredientEffect(effects.restoreMagicka)
    ]
};

export const hagravenClaw = {
    name: 'Hagraven Claw',
    goldValue: 20,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.resistMagic),
        toIngredientEffect(effects.lingeringDamageMagicka),
        toIngredientEffect(effects.fortifyEnchanting),
        toIngredientEffect(effects.fortifyBarter)
    ]
};

export const hagravenFeathers = {
    name: 'Hagraven Feathers',
    goldValue: 20,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageMagicka),
        toIngredientEffect(effects.fortifyConjuration),
        toIngredientEffect(effects.frenzy),
        toIngredientEffect(effects.weaknessToShock)
    ]
};

export const hangingMoss = {
    name: 'Hanging Moss',
    goldValue: 1,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageMagicka),
        toIngredientEffect(effects.fortifyHealth),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.fortifyOneHanded)
    ]
};

export const hawkBeak = {
    name: 'Hawk Beak',
    goldValue: 15,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreStamina),
        toIngredientEffect(effects.resistFrost),
        toIngredientEffect(effects.fortifyCarryWeight),
        toIngredientEffect(effects.resistShock)
    ]
};

export const hawkFeathers = {
    name: 'Hawk Feathers',
    goldValue: 15,
    weight: 0.1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.cureDisease, 1, 1, 0.36),
        toIngredientEffect(effects.fortifyLightArmor),
        toIngredientEffect(effects.fortifyOneHanded),
        toIngredientEffect(effects.fortifySneak)
    ]
};

export const hawksEgg = {
    name: "Hawk's Egg",
    goldValue: 5,
    weight: 0.5,
    dlc: Dlc.HF,
    effects: [
        toIngredientEffect(effects.resistMagic),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.waterbreathing),
        toIngredientEffect(effects.lingeringDamageStamina)
    ]
};

export const histcarp = {
    name: 'Histcarp',
    goldValue: 6,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreStamina),
        toIngredientEffect(effects.fortifyMagicka),
        toIngredientEffect(effects.damageStaminaRegen),
        toIngredientEffect(effects.waterbreathing)
    ]
};

export const honeycomb = {
    name: 'Honeycomb',
    goldValue: 5,
    weight: 1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.restoreStamina),
        toIngredientEffect(effects.fortifyBlock, 0.5),
        toIngredientEffect(effects.fortifyLightArmor),
        toIngredientEffect(effects.ravageStamina)
    ]
};

export const humanFlesh = {
    name: 'Human Flesh',
    goldValue: 1,
    weight: 0.25, 
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageHealth),
        toIngredientEffect(effects.paralysis),
        toIngredientEffect(effects.restoreMagicka),
        toIngredientEffect(effects.fortifySneak)
    ]
}

export const humanHeart = {
    name: 'Human Heart',
    goldValue: 0,
    weight: 1,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageHealth),
        toIngredientEffect(effects.damageMagicka),
        toIngredientEffect(effects.damageMagickaRegen),
        toIngredientEffect(effects.frenzy)
    ]
};

export const iceWraithTeeth = {
    name: 'Ice Wraith Teeth',
    goldValue: 30,
    weight: 0.25,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.weaknessToFrost),
        toIngredientEffect(effects.fortifyHeavyArmor),
        toIngredientEffect(effects.invisibility),
        toIngredientEffect(effects.weaknessToFire)
    ]
};

export const impStool = {
    name: 'Imp Stool',
    goldValue: 0,
    weight: 0.3,
    dlc: Dlc.Vanilla,
    effects: [
        toIngredientEffect(effects.damageHealth),
        toIngredientEffect(effects.lingeringDamageHealth),
        toIngredientEffect(effects.paralysis),
        toIngredientEffect(effects.restoreHealth, 0.6, 1, 0.57)
    ]
};

export const jazbayGrapes = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const juniperBerries = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const largeAntlers = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const lavender = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const lunaMothWing = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const moonSugar = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const moraTapinella = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const mudcrabChitin = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const namirasRot = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const netchJelly = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const nightshade = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const nirnroot = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const nordicBarnacle = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const orangeDartwing = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const pearl = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const pineThrushEgg = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const poisonBloom = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const powderedMammothTusk = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const purpleMountainFlower = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const redMountainFlower = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const riverBetty = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const rockWarblerEgg = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const rockWarblerEgg = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const sabreCatTooth = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const salmonRoe = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const saltPile = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const scalyPholiota = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const scathecraw = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const silversidePerch = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const skeeverTail = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const slaughterfishEgg = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const slaughterfishScales = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const smallAntlers = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const smallPearl = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const snowberries = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const spawnAsh = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const spiderEgg = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const sprigganSap = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const swampFungalPod = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const taproot = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const thistleBranch = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const torchbugThorax = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const tramaRoot = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const trollFat = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const tundraCotton = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const vampireDust = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const voidSalts = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const wheat = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const whiteCap = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const wispWrappings = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};

export const yellowMountainFlower = {
    name: '',
    goldValue: 0,
    weight: 0,
    dlc: null,
    effects: [
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease),
        toIngredientEffect(effects.cureDisease)
    ]
};