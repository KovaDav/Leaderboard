import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import AddRoster from "../Components/AddRoster/AddRoster";
const initSqlJs = require('sql.js');

const CreateLeaderboardPage = () => {

 
   return(
    <>
    <input placeholder="Roster Name"></input>
    <AddRoster></AddRoster>
    </>
   )
};
  
  export default CreateLeaderboardPage;