const {getListOfPlayersMains, getListOfPlayersAlts} = require("../db/db.js")
const fs = require("fs");
const { parse } = require("csv-parse");
const { log } = require("console");


async function getCharacterData() {
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
        findHighestDPS(altNames)
    } catch (error) {
        console.error('Error retrieving players', error);
    }
}

getCharacterData()

function findHighestDPS(players){

    const highestDPSMap = new Map();

    players.forEach(player => highestDPSMap.set(player, 0));

fs.createReadStream("./raided-loa-scraper/data/Akkan_G2_Hard.csv")
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

        console.log("Top 3 players with highest DPS in Akkan HM G1:");
        sortedPlayers.forEach(([player, dps], index) => {
            console.log(`${index + 1}. Player: ${player}, DPS: ${dps}`);
        });
})
  .on("error", function (error) {
    console.log(error.message);
  });
}
function asd(mains){
    
}
