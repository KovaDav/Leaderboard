import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import AddCharacter from "../Components/AddCharacter/AddCharacter";
const initSqlJs = require('sql.js');

const CreateLeaderboardPage = () => {
   const [characters, setCharacters] = useState([{ name: '', class: '', main: false, region: '' }]);
 
   const addCharacter = () => {
      setCharacters([...characters, { name: '', class: '', main: false, region: '' }]);
    };
  

   const sendLeaderboardData = () => {
      console.log(characters);
      fetch(
			`http://localhost:3001/create`
			,
			{
				method: 'POST',
            headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({characters: characters}),

			})
			.then((response) => response.json()
			)
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
   }

   return(
    <>
    {characters.map((character, index) => {
        return <AddCharacter key={index} character={characters[index]}/>
      })}
      <button onClick={e => addCharacter()}>Add New Character</button>
      <button onClick={e => sendLeaderboardData()}>Submit</button>
    </>
   )
};
  
  export default CreateLeaderboardPage;