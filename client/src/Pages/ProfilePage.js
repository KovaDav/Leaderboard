  import { Outlet, Link } from "react-router-dom";
  import {useAuth} from '../Auth/AuthContext'
  import React, { useEffect, useState, useRef } from 'react';
  import ProfileAddCharacter from "../Components/ProfileAddCharacter/ProfileAddCharacter";
  import ProfileShowCharacters from "../Components/ProfileShowCharacters/ProfileShowCharacters";

  const initSqlJs = require('sql.js');
  const ProfilePage = () => {
    const [characterList, setCharacterList] = useState(null);
    const [characters, setCharacters] = useState([]);
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
    const { user } = useAuth();

    useEffect(() => {
      const getCharacterList = () => {
         fetch(
               `http://localhost:3001/get_character_list?userId=${user.id}`
               ,
               {
                   method: 'GET'
               })
               .then((response) => response.json()
               )
               .then((result) => {
                  setCharacters(result.characterList)
                  console.log(result);
               })
               .catch((error) => {
                   console.error('Error:', error);
               });
      }
      getCharacterList()
  }, [])

    useEffect(() => {
      initSqlJs({
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
  
        characterList.forEach(player => {
            console.log('current:' +player.charactername+player.bossname+player.difficulty);
          const nameDpsIdDate = db.exec(`SELECT e.name, e.dps, e.encounter_id, en.last_combat_packet
            FROM entity e
            INNER JOIN encounter en ON e.encounter_id = en.id
            WHERE e.name = '${player.charactername}'
              AND en.id IN (
                SELECT id FROM encounter
                WHERE json_extract(misc, '$.partyInfo') LIKE '%"${player.charactername}"%'
                  AND current_boss = '${player.bossname}'
                  AND difficulty = '${player.difficulty}'
                  AND json_extract(misc, '$.raidClear') = true
              )
            ORDER BY e.dps DESC
            LIMIT 1;`);
  
          if (nameDpsIdDate[0] !== undefined) {
            const highestDps = nameDpsIdDate[0].values[0][1];
            if (highestDps > player.dps) {
                const playerInfo = db.exec(`
                    SELECT e.name, e.dps, e.encounter_id, en.last_combat_packet,
                        CASE
                            WHEN json_extract(en.misc, '$.partyInfo.0') LIKE '%' || e.name || '%' THEN json_extract(en.misc, '$.partyInfo.0')
                            WHEN json_extract(en.misc, '$.partyInfo.1') LIKE '%' || e.name || '%' THEN json_extract(en.misc, '$.partyInfo.1')
                            ELSE NULL
                        END AS containing_key
                    FROM entity e
                    INNER JOIN encounter en ON e.encounter_id = en.id
                    WHERE e.name = '${player.charactername}'
                        AND en.current_boss = '${player.bossname}'
                        AND en.difficulty = '${player.difficulty}'
                        AND json_extract(en.misc, '$.raidClear') = true
                    ORDER BY e.dps DESC
                    LIMIT 1;
                `);
            
                if (playerInfo[0]) {
                    const supportName = db.exec(`
                        SELECT name FROM entity 
                        WHERE encounter_id = '${playerInfo[0].values[0][2]}' 
                            AND name IN ('${JSON.parse(playerInfo[0].values[0][4])[0]}', '${JSON.parse(playerInfo[0].values[0][4])[1]}', '${JSON.parse(playerInfo[0].values[0][4])[2]}', '${JSON.parse(playerInfo[0].values[0][4])[3]}') 
                            AND class IN ('Bard', 'Paladin', 'Artist');
                    `)[0]?.values[0]?.[0] || 'NoSupport';
            
                    sendPlayerData({
                        name: playerInfo[0].values[0][0],
                        dps: highestDps,
                        date: playerInfo[0].values[0][3],
                        support: supportName,
                        boss: player.bossname,
                        difficulty: player.difficulty
                    });
                }
            }
          }
        });
    };
  
    const sendPlayerData = (data) => {
      fetch(
        `http://localhost:3001/dps`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: JSON.stringify(data) }),
        })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  
    const getCharacterList = () => {
      fetch(
        `http://localhost:3001/characters`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        })
        .then((response) => response.json())
        .then((result) => {
          result = JSON.parse(result)
          setCharacterList(result.characterList)     
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  
    useEffect(() => {
      if (characterList === null) {
        getCharacterList();
      }
    }, [characterList]);
  
    return (
      <>
        <input className='description' type="file" name="file" onChange={changeHandler} />
        {error && <div>Error: {error}</div>}
        <ProfileShowCharacters characters={characters} setCharacters={setCharacters}></ProfileShowCharacters>
        <ProfileAddCharacter characters={characters} setCharacters={setCharacters}></ProfileAddCharacter>
      </>
    );
  };
  
  export default ProfilePage;
  