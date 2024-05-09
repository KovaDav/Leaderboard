const express = require("express");
const app = express();
const cors = require("cors");
const {getCharacterData} = require("./LeaderboardCreator/findTop3DPS.js")

app.use(express.json());
app.use(cors());
  

app.post('/top3', async (req, res) => {
    try {
        const data = await getCharacterData(req.body.raid, req.body.mains);
        console.log(data)
        res.json(data);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.listen(3001, () => console.log('Server started on port 3001'));