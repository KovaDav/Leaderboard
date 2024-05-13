const express = require("express");
const app = express();
const cors = require("cors");
const {getCharacterData} = require("./LeaderboardCreator/findTop3DPS.js")
const {findCharacterIdByName, addToRecord} = require("./db/db.js")

app.use(express.json());
app.use(cors());
  

app.get('/dps', async (req, res) => {
    
    const data = JSON.parse(req.query.data);
    const result = await findCharacterIdByName(data.name)
    console.log(await addToRecord(result[0].characterid, data.dps, data.support, data.boss, data.difficulty, data.date));
    res.json({ message: `Received data: ${data}` });
});

app.listen(3001, () => console.log('Server started on port 3001'));