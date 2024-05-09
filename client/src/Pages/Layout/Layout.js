import { Outlet, Link } from "react-router-dom";
import "./Layout.css"
import React, {useEffect, useState, useRef} from 'react';


const Layout = () => (
    <div className="Background">
       <div id="HeaderAndLayoutPageButtonContainer" className="headerDisappear">
       
       <h1 className={"Header"}>LEADERBOARDING</h1>
        <div id="LayoutPageButtonContainer">
            <button className="LayoutPageButton">mains</button>
            <button className="LayoutPageButton">alts</button>
        </div>
       </div>
       <Outlet />
    </div>
);
  
  export default Layout;