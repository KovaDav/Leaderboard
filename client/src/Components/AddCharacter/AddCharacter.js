import React, { useState } from 'react';
import './AddCharacter.css'

const AddCharacter = ({character, addToRoster}) => {
    return (
      <div className='CharacterContainer'>   
        <input placeholder='Character Name' onChange={e => {character.name = e.target.value; addToRoster()}}></input>
        <input type='checkbox' onClick={e => {character.main = !character.main; addToRoster()}}></input>
        <input placeholder='Class' onChange={e => {character.class = e.target.value; addToRoster()}}></input>
      </div>
    );
  }
  
export default AddCharacter;
