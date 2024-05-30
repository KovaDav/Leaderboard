import React, { useState } from 'react';
import './AddCharacter.css'
import Dropdown from '../Dropdown/Dropdown';
const AddCharacter = ({checkbox, character, onCharacterChange }) => {
  const [classList, setClassList] = useState(['Aeromancer', 'Arcanist', 'Artillerist', 'Artist', 'Bard', 'Berserker', 'Breaker', 'Deadeye',
   'Deathblade', 'Destroyer', 'Glaivier', 'Gunlancer', 'Gunslinger', 'Machinist', 'Paladin', 'Reaper', 'Scrapper', 'Shadowhunter', 'Sharpshooter',
    'Slayer', 'Sorceress', 'Souleater', 'Soulfist', 'Striker', 'Summoner', 'Wardancer'])

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      onCharacterChange({ ...character, [name]: newValue });
    };
  
    const handleSelectClass = (option) => {
      onCharacterChange({ ...character, class: option });
    };
  
    const handleSelectRegion = (option) => {
      onCharacterChange({ ...character, region: option });
    };

    const handleSelectMain = (option) => {
      onCharacterChange({ ...character, main: option === 'Main' ? true : false});
    };

    return (
      <div className='CharacterContainer'>   
      <input
        type="text"
        placeholder="Character Name"
        name="name"
        value={character.name}
        onChange={handleInputChange}
      />
      {checkbox &&<>
        <Dropdown
        options={['Main', 'Alt']}
        name={'Main or Alt'}
        onSelect={handleSelectMain}
        selectedOption={character.main}
      />
      <Dropdown
        options={classList}
        name={'Class'}
        onSelect={handleSelectClass}
        selectedOption={character.class}
      />
      </>}
      <Dropdown
        options={['EUC', 'NAW', 'NAE', 'SA']}
        name={'Region'}
        onSelect={handleSelectRegion}
        selectedOption={character.region}
      />
    </div>
    );
  }
  
export default AddCharacter;
