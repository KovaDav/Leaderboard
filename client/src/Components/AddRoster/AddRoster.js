import React, { useState } from 'react';
import './AddRoster.css'
import AddCharacter from '../AddCharacter/AddCharacter';
const AddRoster = ({roster}) => {
  const [characters, setCharacters] = useState([{ name: '', class: '', main: false }]);


  const addCharacter = () => {
    setCharacters([...characters, { name: '', class: '', main: false }]);
  };

  const addToRoster = () => {
    roster.characters = characters

  }
    return (
      <>
      <div className='RosterContainer'>   
        <input placeholder='Roster Name' onChange={e => roster.rosterName = e.target.value}></input>
        <input placeholder='Region' onChange={e => roster.region = e.target.value}></input>
      </div>
      {characters.map((character, index) => {
        return <AddCharacter key={index} character={characters[index]} addToRoster={addToRoster}/>
      })}
      <button onClick={e => addCharacter()}>Add New Character</button>
      </>
    );
  }
  
export default AddRoster;
