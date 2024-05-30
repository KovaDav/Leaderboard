import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import AddCharacter from "../AddCharacter/AddCharacter";
import './ProfileAddCharacter.css'
import {useAuth} from '../../Auth/AuthContext'

const ProfileAddCharacter = () => {
   const [characters, setCharacters] = useState([]);
   const { user } = useAuth();
   const addCharacter = () => {
      setCharacters([...characters, { name: '', class: '', main: false, region: '' }]);
    };
  

   const sendLeaderboardData = () => {
    characters.forEach(character => {
      fetch(
			`http://localhost:3001/add_character_to_user`
			,
			{
				method: 'POST',
            headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({userId: user.id, characterName: character.name, region: character.region}),

			})
			.then((response) => response.json()
			)
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
    });
   }

   const handleCharacterChange = (index, updatedCharacter) => {
      const updatedCharacters = [...characters];
      updatedCharacters[index] = updatedCharacter;
      setCharacters(updatedCharacters);
    };

    const deleteCharacter = (index) => {
      const updatedCharacters = [...characters];
      updatedCharacters.splice(index, 1);
      setCharacters(updatedCharacters);
    };
   return(
    <>
    {characters.map((character, index) => (
         <div key={index}>
         <AddCharacter checkbox={false} character={character} onCharacterChange={(updatedCharacter) => handleCharacterChange(index, updatedCharacter)} />
         <button className="deleteButton" onClick={() => deleteCharacter(index)}>Delete</button>
       </div>
      ))}
      <button onClick={e => addCharacter()}>Add New Character</button>
      <button onClick={e => sendLeaderboardData()}>Save</button>
    </>
   )
};
  
  export default ProfileAddCharacter;