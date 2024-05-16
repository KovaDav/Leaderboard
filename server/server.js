const express = require("express");
const app = express();
const cors = require("cors");
const {getCharacterData} = require("./LeaderboardCreator/findTop3DPS.js")
const {findCharacterIdByName, addToRecord, recordById, addCharacter, addRoster, addLeaderboard, characterAlreadyInALeaderboardById} = require("./db/db.js")
const bossList = [
    ['Killineza the Dark Worshipper', 'Hard'],
    ['Valinak, Herald of the End', 'Hard'],
    ['Thaemine the Lightqueller', 'Hard'],
    ['Thaemine, Conqueror of Stars', 'Hard'],
    ['Veskal', 'Normal'],
    ['Killineza the Dark Worshipper', 'Normal'],
    ['Valinak, Herald of the End', 'Normal'],
    ['Thaemine the Lightqueller', 'Normal'],
    ['Kaltaya, the Blooming Chaos', 'Hard'],
    ['Rakathus, the Lurking Arrogance', 'Hard'],
    ['Firehorn, Trampler of Earth', 'Hard'],
    ['Lazaram, the Trailblazer', 'Hard'],
    ['Kaltaya, the Blooming Chaos', 'Normal'],
    ['Rakathus, the Lurking Arrogance', 'Normal'],
    ['Firehorn, Trampler of Earth', 'Normal'],
    ['Lazaram, the Trailblazer', 'Normal'],
    ['Gargadeth', 'Normal'],
    ['Evolved Maurug', 'Hard'],
    ['Lord of Degradation Akkan', 'Hard'],
    ['Lord of Kartheon Akkan', 'Hard'],
    ['Evolved Maurug', 'Normal'],
    ['Lord of Degradation Akkan', 'Normal'],
    ['Plague Legion Commander Akkan', 'Normal'],
    ['Tienis', 'Hard'],
    ['Prunya', 'Hard'],
    ['Lauriel', 'Hard'],
    ['Sonavel', 'Normal'],
    ['Tienis', 'Normal'],
    ['Prunya', 'Normal'],
    ['Lauriel', 'Normal'],
    ['Hanumatan', 'Normal'],
    ['Gehenna Helkasirs', 'Hard'],
    ['Ashtarot', 'Hard'],
    ['Primordial Nightmare', 'Hard'],
    ['Phantom Legion Commander Brelshaza', 'Hard'],
    ['Gehenna Helkasirs', 'Normal'],
    ['Ashtarot', 'Normal'],
    ['Primordial Nightmare', 'Normal'],
    ['Phantom Legion Commander Brelshaza', 'Normal'],
    ['Saydon', 'Normal'],
    ['Kakul', 'Normal'],
    ['Encore-Desiring Kakul-Saydon', 'Normal'],
    ['Covetous Devourer Vykas', 'Hard'],
    ['Covetous Legion Commander Vykas', 'Hard'],
    ['Covetous Devourer Vykas', 'Normal'],
    ['Covetous Legion Commander Vykas', 'Normal'],
    ['Dark Mountain Predator', 'Hard'],
    ['Ravaged Tyrant of Beasts', 'Hard'],
    ['Dark Mountain Predator', 'Normal'],
    ['Ravaged Tyrant of Beasts', 'Normal'],
]
app.use(express.json());
app.use(cors());
  

app.get('/dps', async (req, res) => {
    
    const data = JSON.parse(req.query.data);
    const result = await findCharacterIdByName(data.name)
    const id = result[0].characterid
    const record = await recordById(id, data.boss, data.difficulty)
    const hasRecord = parseInt(record[0].dps) > 0 ? true : false

    if(record[0].dps >= data.dps){
        res.json({ message: `Has higher record than this: ${data}` })
    }else if(record[0].dps < data.dps){
        //update
    }
    //console.log(await addToRecord(id, data.dps, data.support, data.boss, data.difficulty, data.date));
    res.json({ message: `Received data: ${data}` });
});

app.post('/create', async (req, res) => {
    const rosters = req.body.rosters;
    let characterIdList = [];
    
    try {
        for (const roster of rosters) {
            for (const character of roster.characters) {
                const characterResult = await addCharacter(roster.name, character.name, character.class, character.main, roster.region);
                characterIdList.push(characterResult[0].characterid);        
            }
        }
        for (const id of characterIdList) {
            let recordExists = await characterAlreadyInALeaderboardById(id)
            if(!recordExists[0].exists_in_array){
                for (const boss of bossList) {
                    await addToRecord(id, '', boss[0], boss[1], '0')
                }
            }
        }
        const leaderboardId = await addLeaderboard(characterIdList.map(id => id))
        console.log(leaderboardId);
        res.json(leaderboardId);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3001, () => console.log('Server started on port 3001'));