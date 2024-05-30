import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import AddCharacter from "../AddCharacter/AddCharacter";
import './ProfileAddCharacter.css'
import {useAuth} from '../../Auth/AuthContext'

const ProfileAddCharacter = ({characters, setCharacters}) => {
   const { user } = useAuth();
   const [newCharacters, setNewCharacters] = useState([])
   const addCharacter = () => {
      setNewCharacters([...newCharacters, { name: '', class: '', region: '' }]);
    };
  

   const sendLeaderboardData = () => {
    newCharacters.forEach(character => {
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
				alert(result.message);
                setCharacters(result.characterList)
			})
			.catch((error) => {
				console.error('Error:', error);
			});
    });
    setNewCharacters([])
   }

   const handleCharacterChange = (index, updatedCharacter) => {
      const updatedCharacters = [...newCharacters];
      updatedCharacters[index] = updatedCharacter;
      setNewCharacters(updatedCharacters);
    };

    const deleteCharacter = (index) => {
      const updatedCharacters = [...newCharacters];
      updatedCharacters.splice(index, 1);
      setNewCharacters(updatedCharacters);
    };
   return(
    <>
    {newCharacters.map((character, index) => (
         <div className="addCharacterDeleteButtonContainer" key={index}>
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