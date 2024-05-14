const express = require("express");
const app = express();
const cors = require("cors");
const {getCharacterData} = require("./LeaderboardCreator/findTop3DPS.js")
const {findCharacterIdByName, addToRecord, recordById, addCharacter, addRoster, addLeaderboard} = require("./db/db.js")

app.use(express.json());
app.use(cors());
  

app.get('/dps', async (req, res) => {
    
    const data = JSON.parse(req.query.data);
    const result = await findCharacterIdByName(data.name)
    const id = result[0].characterid
    const record = await recordById(id, data.boss, data.difficulty)
    const hasRecord = parseInt(record[0].dps) > 0 ? true : false

    if(record[0].dps >= data.dps){
        //noupdate
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
            const rosterResult = await addRoster(roster.rosterName, roster.region);
            const rosterId = rosterResult[0].rosterid;
            
            for (const character of roster.characters) {
                const characterResult = await addCharacter(rosterId, character.name, character.class, character.main);
                characterIdList.push(characterResult[0].characterid);
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