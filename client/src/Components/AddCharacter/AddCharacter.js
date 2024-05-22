import React, { useState } from 'react';
import './AddCharacter.css'

const AddCharacter = ({character}) => {
    return (
      <div className='CharacterContainer'>   
        <input placeholder='Character Name' onChange={e => {character.name = e.target.value}}></input>
        <input type='checkbox' onClick={e => {character.main = !character.main}}></input>
        <input placeholder='Class' onChange={e => {character.class = e.target.value}}></input>
      </div>
    );
  }
  
export default AddCharacter;
