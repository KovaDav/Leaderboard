import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import LeaderboardGrid from "../Components/Leaderboard/LeaderboardGrid";
const initSqlJs = require('sql.js');

const LeaderboardPage = () => {
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
    const [leaderboardData, setLeaderboardData] = useState(null)

    useEffect(() =>{
        fetch(
                `http://localhost:3001/leaderboard`
                ,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify(
                    {
                            leaderboardId: "ab1de84c-4c73-4d1d-9bd1-7ba743a36cf2",
                            leaderboardMains: false
                    }),
                })
                .then((response) => response.json()
                )
                .then((result) => {	
                    setLeaderboardData(JSON.parse(result))
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
      },[])

    const LeaderboardGenerator = () => {
        return bossList.map(boss => <LeaderboardGrid title={boss} data={getSpecificBossData(boss)}/>)
     }

    const getSpecificBossData = (boss) => {
        const result = []
        leaderboardData.forEach(record => {
            if(record.boss === boss[0] && record.difficulty === boss[1]){
                result.push(record)
            }
        });
        return result
    }
   return(
    <>
    
    {leaderboardData === null ? null : LeaderboardGenerator()}
    </>
   )
};
  
  export default LeaderboardPage;