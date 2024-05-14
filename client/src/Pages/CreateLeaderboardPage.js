import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import AddRoster from "../Components/AddRoster/AddRoster";
const initSqlJs = require('sql.js');

const CreateLeaderboardPage = () => {
   const [rosters, setRosters] = useState([{ rosterName: '', region: '', characters: []}]);
 
   const addRoster = () => {
      setRosters([...rosters, { rosterName: '', region: '', characters:[]}]);
    };
   return(
    <>
    {rosters.map((character, index) => {
        return <AddRoster key={index} roster={rosters[index]}/>
      })}
      <button onClick={e => addRoster()}>Add New Roster</button>
      <button onClick={e => console.log(rosters)}>Submit</button>
    </>
   )
};
  
  export default CreateLeaderboardPage;