const express = require("express");
const app = express();
const cors = require("cors");
const {getCharacterData} = require("./LeaderboardCreator/findTop3DPS.js")
const {findCharacterIdByName, addToRecord, recordById, addCharacter, addLeaderboard, updateRecordById, getTop3,
     getCharacterListOfLeaderboardMainOrAlt, getCharacterListOfLeaderboard, characterExists, addCharactersToLeaderboard} = require("./db/db.js")
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

    if(record[0].dps >= data.dps){
        res.json({ message: `Has higher record than this` })
        console.log(record[0].dps, data.dps, data.boss, data.name, data.difficulty );
    }else if(record[0].dps < data.dps){
        console.log('updating');
        console.log(await updateRecordById(id, data.dps, data.support, data.boss, data.difficulty, data.date))
        res.json({ message: `Updated existing record` });
    }else{
        await addToRecord(id, data.dps, data.support, data.boss, data.difficulty, data.date);
        res.json({ message: `Added new record` });
    }
});

app.post('/create', async (req, res) => {
    const characters = req.body.characters;
    let characterIdList = [];
    let existingCharacterIdList = [];
    
    try { 
        for (const character of characters) {
            const exists = await characterExists(character.name, character.region)
            if(!exists[0].exists){
                const characterResult = await addCharacter(character.name, character.class, character.main, character.region);
                characterIdList.push(characterResult[0].characterid);
            }else{
                const id = await findCharacterIdByName(character.name, character.region)
                existingCharacterIdList.push(id[0].id)
            }
        }
        for (const id of characterIdList) {
            for (const boss of bossList) {
                await addToRecord(id, '0', '0',  boss[0], boss[1], '0')
            }
        }
        const leaderboardId = await addLeaderboard()
        console.log(leaderboardId[0].id);
        const result = await addCharactersToLeaderboard(leaderboardId[0].id, characterIdList.concat(existingCharacterIdList))
        console.log(result[0]);
        res.json(leaderboardId);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/leaderboard', async (req, res) => {
    const leaderboardId = req.body.leaderboardId;
    const leaderboardMain = req.body.leaderboardMains;
    try {
        const characterList = await getCharacterListOfLeaderboardMainOrAlt(leaderboardId,leaderboardMain)
        const idList = []
        characterList.forEach(character => {
            idList.push(character.characterid)
        });
        const leaderboardData = await getTop3(idList)
        res.json(JSON.stringify(leaderboardData));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/characters', async (req, res) => {
    const leaderboardId = req.body.leaderboardId;
    try {
        const characterList = await getCharacterListOfLeaderboard(leaderboardId)
        const nameList = []
        characterList.forEach(character => {
            nameList.push(character.charactername)
        });
        res.json(JSON.stringify(nameList));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3001, () => console.log('Server started on port 3001'));