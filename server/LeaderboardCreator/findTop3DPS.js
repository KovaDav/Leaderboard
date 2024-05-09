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


async function findHighestDPS(raid, players){
    return new Promise((resolve, reject) => {

    const highestDPSMap = new Map();

    players.forEach(player => highestDPSMap.set(player, 0));

fs.createReadStream(`./raided-loa-scraper/data/${raid}.csv`)
  .pipe(parse({ headers: true }))
  .on("data", (row) => {
    const playerName = row[1];
        const dps = parseFloat(row[4]);

        if (players.includes(playerName) && !isNaN(dps) && dps > highestDPSMap.get(playerName)) {
            highestDPSMap.set(playerName, dps);
        }
  })  
  .on('end', () => {
    const sortedPlayers = [...highestDPSMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        console.log(`Top 3 players with highest DPS in ${raid}:`);
        const result = []
        sortedPlayers.forEach(([player, dps], index) => {
            console.log(`${index + 1}. Player: ${player}, DPS: ${dps}`);
            result.push(
                {
                        player: player,
                        dps: dps
                })
        });
    
        resolve(result)
    })

  .on("error", function (error) {
    console.log(error.message);
  });
});
}


exports.getCharacterData = getCharacterData;