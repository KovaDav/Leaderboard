const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
  

app.get('/test', async (req, res) => {
    try {
        const response = await fetch('https://logs.fau.dev/api/logs?scope=&order=performance', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                cookie : 'sessions=MTcxNDA0MzczN3xOd3dBTkV4RVFrOUJNMEZVTlZNMVZWQllURkkxVWxoVVRUSlFWRFJEVnpKT04xUTJUbGRHVmsxR1RsQlJWazFMVjFSRVJrVkxVMUU9fFAd9RW9Qh4s1D7non2AJMIfZ53-2UHdq9MH23ExxAHp; Path=/;'
            },
            body: JSON.stringify({"raids":{"Ivory":{"gates":[1],"difficulties":["Hard"]}},"guardians":[],"trials":[],"classes":[],"search":"Lyndoniel"})
        });

        const data = await response.json();
        console.log(data.encounters[0])
        res.json(data);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.listen(3001, () => console.log('Server started on port 3001'));