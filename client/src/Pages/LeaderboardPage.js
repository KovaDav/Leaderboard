import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import LeaderboardGrid from "../Components/Leaderboard/LeaderboardGrid";

const LeaderboardPage = () => {
    const [raidList, setRaidList] = useState([
        "Thaemine_G1_Hard",
        "Thaemine_G2_Hard",
        "Thaemine_G3_Hard",
        "Thaemine_G4_Hard",
        "Thaemine_G1_Normal",
        "Thaemine_G2_Normal",
        "Thaemine_G3_Normal",
        "Ivory_G1_Hard",
        "Ivory_G2_Hard",
        "Ivory_G3_Hard",
        "Ivory_G4_Hard",
        "Ivory_G1_Normal",
        "Ivory_G2_Normal",
        "Ivory_G3_Normal",
        "Ivory_G4_Normal",
        "Akkan_G1_Hard", 
        "Akkan_G2_Hard",
        "Akkan_G3_Hard",
        "Veskal",
        "Gargadeth",
        "Sonavel",
        "Akkan_G1_Normal",
        "Akkan_G2_Normal",
        "Akkan_G3_Normal",
        "Brelshaza_G1_Hard",
        "Brelshaza_G2_Hard",
        "Brelshaza_G3_Hard",
        "Brelshaza_G4_Hard",
        "Kayangel_G1_Hard",
        "Kayangel_G2_Hard",
        "Kayangel_G3_Hard"
    ])
    const [mains, setMains] = useState(true)
    const LeaderboardGenerator = () => {
       return raidList.map(e => <LeaderboardGrid title={e} mains={mains}/>)
    }

   return(
    <>
    <div id="SwitchContainer">
    <p className="SwitchText">Mains</p>
    <label class="switch">
    <input type="checkbox" onChange={e => setMains(!mains)}/>
    <span class="slider"></span>
    </label>
    <p className="SwitchText">Alts</p>
    </div>
    {LeaderboardGenerator()}
    </>
   )
};
  
  export default LeaderboardPage;