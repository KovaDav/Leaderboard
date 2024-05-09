import { Outlet, Link, useFetcher } from "react-router-dom";
import "./LeaderboardGrid.css"
import React, {useEffect, useState, useRef} from 'react';


const LeaderboardGrid = ({title, mains}) => {
  const [data, setData] = useState(null)

  useEffect(() =>{
    console.log(mains);
    fetch(
			`http://localhost:3001/top3`
			,
			{
				method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                  },
				body: JSON.stringify(
                {
                        raid: title,
                        mains: mains
                }),
			})
			.then((response) => response.json()
			)
			.then((result) => {	
        setData(result)
			})
			.catch((error) => {
				console.error('Error:', error);
			});
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