import { Outlet, Link } from "react-router-dom";
import "./LeaderboardGrid.css"
import React, {useEffect, useState, useRef} from 'react';


const LeaderboardGrid = () => (
    <div id="LeaderboardGrid">
      <h3 id="Title">raid</h3>
      <p id="HeaderName">name</p>
      <p id="HeaderDPS">DPS</p>
      <p id="HeaderSupport">support</p>
      <p className="Name1">name1</p>
      <p className="Name2">name2</p>
      <p className="Name3">name3</p>
      <p className="DPS1">dps1</p>
      <p className="DPS2">dps2</p>
      <p className="DPS3">dps3</p>
      <p className="Support1">support1</p>
      <p className="Support2">support2</p>
      <p className="Support3">support3</p>
    </div>
);
  
  export default LeaderboardGrid;