const express = require("express");
const app = express();
const cors = require("cors");
const {findCharacterIdByName, addToRecord, recordById, addCharacter, createLeaderboard, updateRecordById, getTop3PerformersByDPS,
     getCharacterListOfLeaderboardMainOrAlt, getCharacterListOfLeaderboard, characterExists, addCharactersToLeaderboard, addCharacterToUser,
     getCharactersOfUser, deleteCharacterFromUser,
     getLeaderboardsThatContainUser} = require("./db/db.js")

const authRoutes = require('./routes/authRoutes');
const { initializePassport } = require('./config/passportConfig.js');
const session = require('express-session');
const passport = require('passport');

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
app.use(cors({
    origin: 'localhost:3000',
    credentials: true
}));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true,cookie: {
    secure: true, 
    httpOnly: false,
    sameSite: 'lax',
  } }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
initializePassport(passport);

const ensureAuthenticated = (req, res, next) => {
    //console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

app.get('/protected', ensureAuthenticated, (req, res) => {
    res.json({ message: 'This is a protected route' });
  });


app.post('/dps', async (req, res) => {
    
    const record = JSON.parse(req.body.data);
    console.log(record);
        console.log(await updateRecordById(record.dps, record.name, record.boss, record.difficulty, record.support, record.date))
    res.json({"ok" : "ok"})
});

app.post('/add_character_to_user', async (req, res) => {
    const { userId, characterName, region } = req.body;
  try {
    const characterResult = await findCharacterIdByName(characterName, region)


    if (characterResult.rowCount === 0) {
      return res.status(404).json({success: false, message: `Character: ${characterName} not found in region: ${region}. This character is not part of any leaderboard yet.` });
    }
    console.log(characterResult.rows);
    const characterId = characterResult.rows[0].id;

    await addCharacterToUser(userId, characterId);

    const characterList = await getCharactersOfUser(userId)
    res.status(200).json({success: true, message: 'Character added to user successfully', characterList: characterList });
  } catch (error) {
    console.error('Error adding character to user', error);
    res.status(500).json({success: false, message: 'Internal server error' });
  } 

});

app.get('/get_character_list', async (req, res) => {
    const userId = req.query.userId;
  try {
    const characterList = await getCharactersOfUser(userId)

    if (characterList.rowCount === 0) {
      return res.status(404).json({ message: `There is no character registered to this user yet` });
    }

    res.status(200).json({ characterList: characterList });
  } catch (error) {
    console.error('Error adding character to user', error);
    res.status(500).json({ message: 'Internal server error' });
  } 
});

app.post('/delete_character_from_user', async (req, res) => {
    const { userId, characterName, region } = req.body;
    console.log(characterName, region, userId);
  try {
    const characterResult = await findCharacterIdByName(characterName, region)

    if (characterResult.rowCount === 0) {
      return res.status(404).json({ message: `Character: ${characterName} not found in region: ${region}. This character is not part of any leaderboard yet.` });
    }
    const characterId = characterResult.rows[0].id;

    await deleteCharacterFromUser(userId, characterId);

    const characterList = await getCharactersOfUser(userId)
    res.status(200).json({ characterList : characterList });
  } catch (error) {
    console.error('Error adding character to user', error);
    res.status(500).json({ message: 'Internal server error' });
  } 
});

app.post('/create', async (req, res) => {
    const characters = req.body.characters;
    const userId = req.body.userId
    const characterIdList = new Map();
    const existingCharacterIdList = new Map();
    console.log(userId);
    
    try { 
        for (const character of characters) {
            const exists = await characterExists(character.name, character.region)
            if(!exists[0].exists){
                const characterResult = await addCharacter(character.name, character.class, character.region);
                console.log(characterResult[0].id);
                characterIdList.set(characterResult[0].id, character.main);
            }else{
                const id = await findCharacterIdByName(character.name, character.region)
                existingCharacterIdList.set(id.rows[0].id, character.main)
            }
        }
        for (const id of characterIdList.keys()) {
            for (const boss of bossList) {
                await addToRecord(id, 0, 'noSupp',  boss[0], boss[1], 0)
            }
        }
        const leaderboardId = await createLeaderboard(parseInt(userId))

        const allCharacters = new Map([...characterIdList, ...existingCharacterIdList])
        console.log(allCharacters);
        await addCharactersToLeaderboard(leaderboardId[0].id, allCharacters)
        res.status(200).json({success: true, id: leaderboardId[0].id});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({success: false, error: 'Internal server error' });
    }
});

app.post('/leaderboard', async (req, res) => {
    const leaderboardId = req.body.leaderboardId;
    const leaderboardMain = req.body.leaderboardMains;
    try {
        const leaderboardData = await getTop3PerformersByDPS(leaderboardId,leaderboardMain)
        res.json(JSON.stringify(leaderboardData));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/characters', async (req, res) => {
    const userId = req.body.userId;
    
    try {
        const leaderboardList = await getLeaderboardsThatContainUser(userId)
        if(leaderboardList.rowCount === 0){
            return res.status(404).json({ message: `User has no characters linked to account that are in leaderboard.` });
        }
        
        let characterList = []
        for (const leaderboard of leaderboardList) {
            const records = await getCharacterListOfLeaderboard(leaderboard.leaderboardid)
            
            records.forEach(record => {
                characterList.push(record)
            });
        }
        console.log(characterList);
        res.json(JSON.stringify({characterList: characterList}));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3001, () => console.log('Server started on port 3001'));