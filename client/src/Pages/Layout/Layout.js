import { Outlet, Link } from "react-router-dom";
import "./Layout.css"
import React, {useEffect, useState, useRef} from 'react';
import {useAuth} from '../../Auth/AuthContext'
import {  } from 'react-router-dom';
const Layout = () => {
  const { user } = useAuth();
  const { logout } = useAuth();

  return(
    <div className="Background">
      <div id="HeaderContainer">
      <h1 className={"Header"}>LEADERBOARDING</h1>
      {user === null &&
      <>
      <Link to={'/login'}><button className="HeaderButton">login</button></Link>
      <Link to={'/register'}><button className="HeaderButton">register</button></Link>
      </>}
      {user !== null &&
      <>
      <Link to={'/profile'}><button className="HeaderButton">profile</button></Link>
      <Link to={'/create'}><button className="HeaderButton">create</button></Link>
      <Link to={'/login'}><button className="HeaderButton" onClick={e => logout()}>logout</button></Link>
      </>}
      </div>
      <Outlet/>
    </div>
)
};
  
  export default Layout;