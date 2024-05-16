import React, { useState } from 'react';
import "./LeaderboardGrid.css"

const LeaderboardGrid = ({ title, data }) => {
   


    return (
        <>
    {(data === null || data[0].dps !== 0)  &&<div id="LeaderboardGrid">
      <h3 id="Title" className="Grid">{title}</h3>
      <p id="HeaderName" className="Grid">name</p>
      <p id="HeaderDPS" className="Grid">DPS</p>
      <p id="HeaderSupport" className="Grid">support</p>
      <p className="Name1 Grid">{data == null ? "N/A" : data[0].charactername}</p>
      <p className="Name2 Grid">{data == null ? "N/A" : data[1].charactername}</p>
      <p className="Name3 Grid">{data == null ? "N/A" : data[2].charactername}</p>
      <p className="DPS1 Grid">{data == null ? "N/A" : data[0].dps}</p>
      <p className="DPS2 Grid">{data == null ? "N/A" : data[1].dps}</p>
      <p className="DPS3 Grid">{data == null ? "N/A" : data[2].dps}</p>
      <p className="Support1 Grid">{data === null ? 'N/A' : data[0].support}</p>
      <p className="Support2 Grid">{data === null ? 'N/A' : data[1].support}</p>
      <p className="Support3 Grid">{data === null ? 'N/A' : data[2].support}</p>
    </div>}
        </>
    );
};

export default LeaderboardGrid;
