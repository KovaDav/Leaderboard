const express = require("express");
const app = express();
const cors = require("cors");
const {getCharacterData} = require("./LeaderboardCreator/findTop3DPS.js")
const {findCharacterIdByName, addToRecord, recordById, addCharacter, addLeaderboard, updateRecordById, getTop3PerformersByDPS,
     getCharacterListOfLeaderboardMainOrAlt, getCharacterListOfLeaderboard, characterExists, addCharactersToLeaderboard, addCharacterToUser,
     getCharactersOfUser, deleteCharacterFromUser} = require("./db/db.js")

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
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true,cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: 'lax',
  } }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
initializePassport(passport);

const ensureAuthenticated = (req, res, next) => {
    console.log(req.isAuthenticated());
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
      return res.status(404).json({ message: `Character: ${characterName} not found in region: ${region}. This character is not part of any leaderboard yet.` });
    }

    const characterId = characterResult[0].id;

    await addCharacterToUser(userId, characterId);
    
    const characterList = await getCharactersOfUser(userId)
    res.status(200).json({ message: 'Character added to user successfully', characterList: characterList });
  } catch (error) {
    console.error('Error adding character to user', error);
    res.status(500).json({ message: 'Internal server error' });
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
    console.log(characterResult);
    const characterId = characterResult[0].id;

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
    let characterIdList = [];
    let existingCharacterIdList = [];
    
    try { 
        for (const character of characters) {
            const exists = await characterExists(character.name, character.region)
            if(!exists[0].exists){
                const characterResult = await addCharacter(character.name, character.class, character.main, character.region);
                console.log(characterResult[0].id);
                characterIdList.push(characterResult[0].id);
            }else{
                const id = await findCharacterIdByName(character.name, character.region)
                existingCharacterIdList.push(id[0].id)
            }
        }
        for (const id of characterIdList) {
            for (const boss of bossList) {
                await addToRecord(id, 0, 'noSupp',  boss[0], boss[1], 0)
            }
        }
        const leaderboardId = await addLeaderboard()
        const result = await addCharactersToLeaderboard(leaderboardId[0].id, characterIdList.concat(existingCharacterIdList))
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
        const leaderboardData = await getTop3PerformersByDPS(leaderboardId,leaderboardMain)
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
        res.json(JSON.stringify(characterList));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3001, () => console.log('Server started on port 3001'));