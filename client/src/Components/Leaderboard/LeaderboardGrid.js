import { Outlet, Link, useFetcher } from "react-router-dom";
import "./LeaderboardGrid.css"
import React, {useEffect, useState, useRef} from 'react';
const initSqlJs = require('sql.js');

const LeaderboardGrid = ({title, mains}) => {
  const [data, setData] = useState(null)

  useEffect(() =>{
    initSqlJs({
      locateFile: name => 'D:/suli/encounters.db' + name
    }).then(SQL => {
      const db = new SQL.Database()
      const result = db.exec(`SELECT * FROM entity where name = 'Lyndoniel' and encounter_id IN (
        SELECT id FROM encounter WHERE json_extract(misc, '$.partyInfo') like '%"Lyndoniel"%' AND current_boss = 'Veskal' AND json_extract(misc, '$.raidClear') = true)
        order by dps desc;`)
      console.log(result)
    })
  },[])
    
  return(
    <>
    {(data === null || data[0].dps !== 0)  &&<div id="LeaderboardGrid">
      <h3 id="Title" className="Grid">{title}</h3>
      <p id="HeaderName" className="Grid">name</p>
      <p id="HeaderDPS" className="Grid">DPS</p>
      <p id="HeaderSupport" className="Grid">support</p>
      <p className="Name1 Grid">{data == null ? "N/A" : data[0].player}</p>
      <p className="Name2 Grid">{data == null ? "N/A" : data[1].player}</p>
      <p className="Name3 Grid">{data == null ? "N/A" : data[2].player}</p>
      <p className="DPS1 Grid">{data == null ? "N/A" : data[0].dps}</p>
      <p className="DPS2 Grid">{data == null ? "N/A" : data[1].dps}</p>
      <p className="DPS3 Grid">{data == null ? "N/A" : data[2].dps}</p>
      <p className="Support1 Grid">N/A</p>
      <p className="Support2 Grid">N/A</p>
      <p className="Support3 Grid">N/A</p>
    </div>}
  </>
)
};
  
  export default LeaderboardGrid;