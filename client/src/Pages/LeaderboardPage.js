import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import LeaderboardGrid from "../Components/Leaderboard/LeaderboardGrid";
const initSqlJs = require('sql.js');

const LeaderboardPage = () => {

    const [playerList, setPlayerList] = useState([
        "Lyndoniel","Ingabet","Ylin", "Nuggetpunch","Derioss","Kongfusion"
    ])
    const [bossList, setBossList] = useState([
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
            console.log(boss[0]);
        playerList.forEach(player => {
           let nameDpsIdDate = db.exec(`SELECT e.name, e.dps,e.encounter_id, en.last_combat_packet
           FROM entity e
           INNER JOIN encounter en ON e.encounter_id = en.id
           WHERE e.name = '${player}'
           AND en.id IN (
               SELECT id FROM encounter
               WHERE json_extract(misc, '$.partyInfo') LIKE '%"${player}"%'
               AND current_boss = '${boss[0]}'
               AND difficulty = '${boss[1]}'
               AND json_extract(misc, '$.raidClear') = true
           )
           ORDER BY e.dps DESC
           LIMIT 1;`);
           console.log(nameDpsIdDate[0]);
            if(nameDpsIdDate[0] !== undefined){
 
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
            let hasSupport = true;
            let support = db.exec(`
            select name from entity where encounter_id = '${nameDpsIdDate[0].values[0][2]}' 
            and name in ('${JSON.parse(partyInfo[0].values[0][1])[0]}','${JSON.parse(partyInfo[0].values[0][1])[1]}','${JSON.parse(partyInfo[0].values[0][1])[2]}','${JSON.parse(partyInfo[0].values[0][1])[3]}') and class in ('Bard', 'Paladin', 'Artist');
            `)
            
            support[0] === undefined ? hasSupport = false : hasSupport = true;

            sendPlayerData(JSON.stringify({
                name: nameDpsIdDate[0].values[0][0], 
                dps: nameDpsIdDate[0].values[0][1], 
                date: nameDpsIdDate[0].values[0][3], 
                support: hasSupport ? support[0].values[0][0] : 'NoSupport',
                boss: boss[0],
                difficulty: boss[1]
            })) 
            }
            else{
            sendPlayerData(JSON.stringify({
                name: player,
                dps: 0,
                date: 0,
                support: '',
                boss: boss[0],
                difficulty: boss[1]
            })) 
            } 
        });
        
    }); 
    console.log(dpsPBList);
       };
       const sendPlayerData = (data) =>{
        fetch(
			`http://localhost:3001/dps?data=${data}`
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