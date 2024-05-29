import React, { useState } from 'react';
import './AddCharacter.css'
import Dropdown from '../Dropdown/Dropdown';
const AddCharacter = ({character}) => {
  const [classList, setClassList] = useState(['Aeromancer', 'Arcanist', 'Artillerist', 'Artist', 'Bard', 'Berserker', 'Breaker', 'Deadeye',
   'Deathblade', 'Destroyer', 'Glaivier', 'Gunlancer', 'Gunslinger', 'Machinist', 'Paladin', 'Reaper', 'Scrapper', 'Shadowhunter', 'Sharpshooter',
    'Slayer', 'Sorceress', 'Souleater', 'Soulfist', 'Striker', 'Summoner', 'Wardancer'])

    const handleSelectClass = (option) => {
      character.class = option
    };

    const handleSelectRegion = (option) => {
      character.region = option
    };

    return (
      <div className='CharacterContainer'>   
        <input placeholder='Character Name' onChange={e => {character.name = e.target.value}}></input>
        <input type='checkbox' onClick={e => {character.main = !character.main}}></input>
        <Dropdown options={classList} name={'Class'} onSelect={handleSelectClass}></Dropdown>
        <Dropdown options={['EUC', 'NAW', 'NAE', 'SA']} name={'Region'} onSelect={handleSelectRegion}></Dropdown>
      </div>
    );
  }
  
export default AddCharacter;
