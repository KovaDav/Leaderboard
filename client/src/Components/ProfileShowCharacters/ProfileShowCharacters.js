import { Outlet, Link } from "react-router-dom";
import React, {useEffect, useState, useRef} from 'react';
import AddCharacter from "../AddCharacter/AddCharacter";
import './ProfileShowCharacters.css'
import {useAuth} from '../../Auth/AuthContext'

const ProfileShowCharacters = ({characters, setCharacters}) => {
   const { user } = useAuth();
  
useEffect(() => {
printCharacters()
    
})

const printCharacters = () => {

    return characters.map((character, index) => (  <div className="characterContainer" key={index}>
    <p>{character.name}</p>
    <p>{character.class}</p>
    <p>{character.region}</p>
    <button className="deleteButton" onClick={() => deleteCharacter(index)}>Delete</button>
   </div>
    ))
}

    const deleteCharacter = (index) => {
        fetch(
            `http://localhost:3001/delete_character_from_user`
            ,
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({userId: user.id, characterName: characters[index].name, region: characters[index].region}),

			})
            
            .then((response) => response.json()
            )
            .then((result) => {
               setCharacters(result.characterList)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
   return(
    <>
    {characters !== null && printCharacters()}
    </>
   )
};
  
  export default ProfileShowCharacters;