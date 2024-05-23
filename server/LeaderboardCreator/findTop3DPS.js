const {getListOfPlayersMains, getListOfPlayersAlts, getListOfSupports} = require("../db/db.js")
const fs = require("fs");
const { parse } = require("csv-parse");
const { log } = require("console");


async function getCharacterData(raid, main) {
    try {
        const mains = await getListOfPlayersMains("e7bb870b-e4cb-47e4-8fbc-167e0603bc29")
        const mainNames = []
        mains.forEach(e => {
            mainNames.push(e.charactername)
        });
        
        const alts = await getListOfPlayersAlts("e7bb870b-e4cb-47e4-8fbc-167e0603bc29")
        const altNames = []
        alts.forEach(e => {
            altNames.push(e.charactername)
        });

        const supports = await getListOfSupports("e7bb870b-e4cb-47e4-8fbc-167e0603bc29")
        const supportNames = []
        supports.forEach(e => {
            supportNames.push(e.charactername)
        });

                 
        const result = await findHighestDPS(raid, main ? mainNames : altNames)
        return result       
    } catch (error) {
        console.error('Error retrieving players', error);
    }
}




exports.getCharacterData = getCharacterData;