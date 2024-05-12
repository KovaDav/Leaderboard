import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import LeaderboardGrid from "../Components/Leaderboard/LeaderboardGrid";
const initSqlJs = require('sql.js');

const LeaderboardPage = () => {

    const [playerList, setPlayerList] = useState([
        "Lyndoniel","Ingabet","Ylin", "Nuggetpunch","Derioss","Kongfusion"
    ])
    const [bossList, setBossList] = useState([
        "Evolved Maurug",'Lord of Degradation Akkan',"Lord of Kartheon Akkan"
    ])
    

    const [error, setError] = useState(null);
    const [SQL, setSQL] = useState(null);

       // Initialize SQL.js when the component mounts
       useState(() => {
           initSqlJs({
               // Required to load the wasm binary asynchronously.
               locateFile: file => `https://sql.js.org/dist/${file}`
           }).then(sql => {
               setSQL(sql);
           }).catch(err => {
               setError(err);
           });
       }, []);
   
       const changeHandler = (e) => {
           if (!SQL) {
               setError("SQL.js is not initialized");
               return;
           }
   
           const file = e.target.files[0];
           if (!file) {
               setError("No file selected");
               return;
           }
   
           const reader = new FileReader();
           reader.onload = () => {
               const buffer = reader.result;
               const db = new SQL.Database(new Uint8Array(buffer));
               query(db);
           };
           reader.onerror = (err) => {
               setError(err);
           };
           reader.readAsArrayBuffer(file);
       };
   
       const query = (db) => {
           if (!db) {
               setError("Database is not initialized");
               return;
           }

        

        const dpsPBList = [];

        bossList.forEach(boss => { 
        playerList.forEach(player => {
           let nameDpsIdDate = db.exec(`SELECT e.name, e.dps,e.encounter_id, en.last_combat_packet
           FROM entity e
           INNER JOIN encounter en ON e.encounter_id = en.id
           WHERE e.name = '${player}'
           AND en.id IN (
               SELECT id FROM encounter
               WHERE json_extract(misc, '$.partyInfo') LIKE '%"${player}"%'
               AND current_boss = '${boss}'
               AND json_extract(misc, '$.raidClear') = true
           )
           ORDER BY e.dps DESC
           LIMIT 1;`);
            console.log(nameDpsIdDate[0].values[0])
            let partyInfo = db.exec(`SELECT 
            id,
                CASE
                    WHEN json_extract(misc, '$.partyInfo.0') LIKE '%"${player}"%' THEN json_extract(misc, '$.partyInfo.0')
                    WHEN json_extract(misc, '$.partyInfo.1') LIKE '%"${player}"%' THEN json_extract(misc, '$.partyInfo.1')
                    ELSE NULL
                END AS containing_key
            FROM encounter 
            WHERE id = '${nameDpsIdDate[0].values[0][2]}';
            `)
            
            console.log(JSON.parse(partyInfo[0].values[0][1])[0])
            let support = db.exec(`
            select name from entity where encounter_id = '${nameDpsIdDate[0].values[0][2]}' 
            and name in ('${JSON.parse(partyInfo[0].values[0][1])[0]}','${JSON.parse(partyInfo[0].values[0][1])[1]}','${JSON.parse(partyInfo[0].values[0][1])[2]}','${JSON.parse(partyInfo[0].values[0][1])[3]}') and class in ('Bard', 'Paladin', 'Artist');
            `)
            console.log(support[0].values[0][0])
            sendPlayerData(nameDpsIdDate[0].values[0][0], nameDpsIdDate[0].values[0][1], nameDpsIdDate[0].values[0][3], support[0].values[0][0])   
        });
        
    }); 
    console.log(dpsPBList);
       };
       const sendPlayerData = (player, dps, support, date) =>{
        fetch(
			`http://localhost:3001/dps?player=${player}&dps=${dps}&support=${support}&date=${date}`
			
			,
			{
				method: 'GET',
			})
			.then((response) => response.json()
			)
			.then((result) => {
				console.log(result); 	
			})
			.catch((error) => {
				console.error('Error:', error);
			});
       }
   return(
    <>
    <input className='description' type="file" name="file" onChange={changeHandler} />
    {error && <div>Error: {error}</div>}
    <LeaderboardGrid />
    </>
   )
};
  
  export default LeaderboardPage;