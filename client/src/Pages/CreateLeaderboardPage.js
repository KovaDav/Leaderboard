import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import AddRoster from "../Components/AddRoster/AddRoster";
const initSqlJs = require('sql.js');

const CreateLeaderboardPage = () => {
   const [rosters, setRosters] = useState([{ rosterName: '', region: '', characters: []}]);
 
   const addRoster = () => {
      setRosters([...rosters, { rosterName: '', region: '', characters:[]}]);
    };

   const sendLeaderboardData = () => {
      console.log(rosters);
      fetch(
			`http://localhost:3001/create`
			,
			{
				method: 'POST',
            headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({rosters: rosters}),

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
    {rosters.map((character, index) => {
        return <AddRoster key={index} roster={rosters[index]}/>
      })}
      <button onClick={e => addRoster()}>Add New Roster</button>
      <button onClick={e => sendLeaderboardData()}>Submit</button>
    </>
   )
};
  
  export default CreateLeaderboardPage;