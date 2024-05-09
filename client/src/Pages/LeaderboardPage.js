import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import LeaderboardGrid from "../Components/Leaderboard/LeaderboardGrid";

const LeaderboardPage = () => (
   <LeaderboardGrid />
);
  
  export default LeaderboardPage;