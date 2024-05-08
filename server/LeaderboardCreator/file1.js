const {getListOfPlayersMains, getListOfPlayersAlts} = require("../db/db.js")
const fs = require("fs");
const { parse } = require("csv-parse");
let akkang1 = []

async function getData() {
    try {
        const mains = await getListOfPlayersMains("773bab54-df79-4eda-8381-f161bfbdbeaa")
        const alts = await getListOfPlayersAlts("773bab54-df79-4eda-8381-f161bfbdbeaa")
        asd(mains)
    } catch (error) {
        console.error('Error retrieving players', error);
    }
}

getData()

function findHighestDPS(playerName){
let highestDPS = 0;
fs.createReadStream("./raided-loa-scraper/data/Akkan_G1_Hard.csv")
  .pipe(parse({ headers: true }))
  .on("data", (row) => {
    if(row[1] === playerName){
        const dps = parseFloat(row[4]);
        if (!isNaN(dps) && dps > highestDPS){
            highestDPS = dps
        }
    }
  })  
  .on('end', () => {
    if (highestDPS !== -Infinity) {
        console.log(`Highest DPS for player in akkan HM g1 ${playerName}: ${highestDPS}`);
    } else {
        console.log(`Player ${playerName} not found in the CSV file`);
    }
})
  .on("error", function (error) {
    console.log(error.message);
  });
}
function asd(mains){
    mains.forEach(e => {
        findHighestDPS(e.charactername)
    });
}
