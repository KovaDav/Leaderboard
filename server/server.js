const express = require("express");
const app = express();
const cors = require("cors");
const {getCharacterData} = require("./LeaderboardCreator/findTop3DPS.js")
const {findCharacterIdByName, addToRecord, recordById} = require("./db/db.js")

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

app.get('/members', async (req, res) => {

});

app.listen(3001, () => console.log('Server started on port 3001'));