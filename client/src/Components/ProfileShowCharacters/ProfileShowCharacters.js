import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import AddCharacter from "../AddCharacter/AddCharacter";
import './ProfileShowCharacters.css'
import {useAuth} from '../../Auth/AuthContext'

const ProfileShowCharacters = () => {
   const [characters, setCharacters] = useState(null);
   const { user } = useAuth();
  
useEffect(() => {
    const getCharacterList = () => {
       fetch(
             `http://localhost:3001/get_character_list?userId=${user.id}`
             ,
             {
                 method: 'GET'
             })
             .then((response) => response.json()
             )
             .then((result) => {
                setCharacters(result.characterList)
                console.log(result);
             })
             .catch((error) => {
                 console.error('Error:', error);
             });
    }
    getCharacterList()
}, [])

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
    {characters !== null &&characters.map((character, index) => (
        <div className="characterContainer" key={index}>
        <p>{character.character_name}</p>
        <p>{character.character_class}</p>
        <p>{character.character_region}</p>
        <button className="deleteButton" onClick={() => deleteCharacter(index)}>Delete</button>
       </div>
      ))}
    </>
   )
};
  
  export default ProfileShowCharacters;