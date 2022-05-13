import { openDB } from "./infrastructure/db/db.js";
import {DB_NAME, VERSION, ING_OBJ_STORE, EFFECT_IDX} from './infrastructure/config.js';
import { tag } from "./infrastructure/html/html.js";

/**
 * @type {HTMLTableElement}
 */
const table = document.querySelector('#effect-table');

openDB(DB_NAME, () => {
    //
}, VERSION).then(db => {
    console.debug('loading table');
    loadTable(db);
});

/**
 * 
 * @param {IDBDatabase} db 
 */
function loadTable(db) {
    const tx = db.transaction(ING_OBJ_STORE);
    const effectIndex = tx.objectStore(ING_OBJ_STORE).index(EFFECT_IDX);
    const cursorReq = effectIndex.openCursor();
    let currentRow;
    let previousEffect = '';
    cursorReq.addEventListener('success', ev => {
        const cursor = cursorReq.result;
        if (cursor) {
            const currentEffect = cursor.key;
            if (currentEffect !== previousEffect) {
                previousEffect = currentEffect;
                // append new row
                currentRow = table.tBodies[0].insertRow();
                fillNewRow(currentRow, currentEffect, cursor.primaryKey, cursor.value);
            } else {
                // add new list item to 2nd cells' ordered list
                // add any multipliers as <sup> tags.
                appendToExistingRow(currentRow, currentEffect, cursor.primaryKey, cursor.value);
            }
            cursor.continue();
        }
    });
}

/**
 * Fills a new row for the effects table, and adds the ingredient to the 
 * list of ingredients along with any multipliers.
 * 
 * @param {HTMLTableRowElement} tRow 
 * @param {string} effectName 
 * @param {string} ingredientName 
 * @param {import("./infrastructure/db/db.js").IngredientEntry} ingredientData 
 */
function fillNewRow(tRow, effectName, ingredientName, ingredientData) {
    const ingredientEffectIndex = ingredientData.effectNames.indexOf(effectName);
    const effectCell = tRow.insertCell();
    effectCell.appendChild(createDataTag(effectName));

    const ingredientCell = tRow.insertCell();
    const ingredientWithMultipliers = [createDataTag(ingredientName)];
    const effect = ingredientData.effects[ingredientEffectIndex];
    if (!ingredientData.dlc === 'Vanilla') {
        let acronym = '';
        if (ingredientData.dlc === 'Dawnguard') acronym = 'DG';
        if (ingredientData.dlc === 'Hearthfire') acronym = 'HF';
        if (ingredientData.dlc === 'Dragonborn') acronym = 'DB';
        console.debug(acronym);
        ingredientWithMultipliers.push(tag('sup', {
            content: acronym
        }));
    }
    if (effect.cost.multiplier > 1 || effect.cost.multiplier < 1) {
        ingredientWithMultipliers.push(tag('span', {
            children: [
                createDataTag(effect.cost.multiplier, `${effect.cost.multiplier}x`),
                tag('span', {content: ' Cost'})
            ]
        }));
    }
    if (effect.duration.multiplier > 1 || effect.duration.multiplier < 1) {
        ingredientWithMultipliers.push(tag('span', {
            children: [
                createDataTag(effect.duration.multiplier, `${effect.duration.multiplier}x`),
                tag('span', {content: ' Dur'})
            ]
        }));
    }
    if (effect.magnitude.multiplier > 1 || effect.magnitude.multiplier < 1) {
        ingredientWithMultipliers.push(tag('span', {
            children: [
                createDataTag(effect.magnitude.multiplier, `${effect.magnitude.multiplier}x`),
                tag('span', {content: ' Mag'})
            ]
        }))
    }
    const olList = tag('ol', {
        children: [
            tag('li', {
                children: ingredientWithMultipliers
            })
        ]
    });
    ingredientCell.appendChild(olList);

    const descriptionCell = tRow.insertCell();
    descriptionCell.appendChild(createDataTag(effect.description));

    const baseCostCell = tRow.insertCell();
    baseCostCell.appendChild(createDataTag(effect.cost.baseCost));

    const baseMagCell = tRow.insertCell();
    baseMagCell.appendChild(createDataTag(effect.magnitude.baseMag));

    const baseDurCell = tRow.insertCell();
    baseDurCell.appendChild(createDataTag(effect.duration.baseDur));
}

/**
 * 
 * @param {string | number} value 
 * @param {string | number} content 
 * @returns 
 */
function createDataTag(value, content=value) {
    const dataTag = document.createElement('data');
    dataTag.value = value;
    dataTag.textContent = content;
    return dataTag;
}

/**
 * Adds the ingredient to the existing row as well as any multipliers.
 * 
 * @param {HTMLTableRowElement} tRow 
 * @param {string} effectName
 * @param {string} ingredientName 
 * @param {import("./infrastructure/db/db.js").IngredientEntry} ingredientData 
 */
function appendToExistingRow(tRow, effectName, ingredientName, ingredientData) {
    const list = tRow.cells[1].firstElementChild;
    const ingredientEffectIndex = ingredientData.effectNames.indexOf(effectName);
    const ingredientWithMultipliers = [createDataTag(ingredientName)];
    const effect = ingredientData.effects[ingredientEffectIndex];

    if (ingredientData.dlc !== 'Vanilla') {
        let acronym = '';
        if (ingredientData.dlc === 'Dawnguard') acronym = 'DG';
        if (ingredientData.dlc === 'Hearthfire') acronym = 'HF';
        if (ingredientData.dlc === 'Dragonborn') acronym = 'DB';
        console.debug(acronym);
        ingredientWithMultipliers.push(tag('sup', {
            children: [createDataTag(acronym)]
        }));
    }

    if (effect.cost.multiplier > 1 || effect.cost.multiplier < 1) {
        ingredientWithMultipliers.push(tag('span', {
            children: [
                createDataTag(effect.cost.multiplier, `${effect.cost.multiplier}x`),
                tag('span', {content: ' Cost'})
            ]
        }));
    }
    if (effect.duration.multiplier > 1 || effect.duration.multiplier < 1) {
        ingredientWithMultipliers.push(tag('span', {
            children: [
                createDataTag(effect.duration.multiplier, `${effect.duration.multiplier}x`),
                tag('span', {content: ' Dur'})
            ]
        }));
    }
    if (effect.magnitude.multiplier > 1 || effect.magnitude.multiplier < 1) {
        ingredientWithMultipliers.push(tag('span', {
            children: [
                createDataTag(effect.magnitude.multiplier, `${effect.magnitude.multiplier}x`),
                tag('span', {content: ' Mag'})
            ]
        }))
    }
    const li = tag('li', {
        children: ingredientWithMultipliers
    });
    list.appendChild(li);
}

