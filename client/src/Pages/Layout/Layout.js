import { Outlet, Link } from "react-router-dom";
import "./Layout.css"
import React, {useEffect, useState, useRef} from 'react';


const Layout = () => (
    <div className="Background">
       
       <h1 className={"Header"}>LEADERBOARDING</h1>

       <Outlet/>
    </div>
);
  
  export default Layout;