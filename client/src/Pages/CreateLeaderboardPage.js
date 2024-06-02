import React, {useState} from 'react';
import AddCharacter from "../Components/AddCharacter/AddCharacter";
import {useAuth} from '../Auth/AuthContext'

const CreateLeaderboardPage = () => {
   const [characters, setCharacters] = useState([{ name: '', class: '', main: null, region: '' }]);
   const { user } = useAuth();
   const addCharacter = () => {
      setCharacters([...characters, { name: '', class: '', main: null, region: '' }]);
    };
  

   const sendLeaderboardData = () => {
    let dataValid = true
    characters.forEach(character => {
      if(character.name === '' || character.class === '' || character.main === null || character.region === ''){
        alert('Every field is required to be filled out.')
        dataValid = false
        return
      }
    });
    if(dataValid){
      fetch(
			`https://leaderboard-s22v.onrender.com/create`
			,
			{
				method: 'POST',
            headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({userId: user.id ,characters: characters}),

			})
			.then((response) => response.json()
			)
			.then((result) => {
        console.log(result);
				if(result.success){
          alert(`Leaderboard successfully created here is your leaderboard's id: ${result.id}.
          If there is no data uploaded of these characters, you will have to set up your characters in the Profile page and upload your encounters.db!`)
          window.open(`localhost:3000/leaderboard/${result.id}`, "_blank") 
        }
			})
			.catch((error) => {
				console.error('Error:', error);
			});
    }
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
         <div className="addCharacterDeleteButtonContainer" key={index}>
         <AddCharacter checkbox={true} character={character} onCharacterChange={(updatedCharacter) => handleCharacterChange(index, updatedCharacter)} />
         <button className="deleteButton" onClick={() => deleteCharacter(index)}>Delete</button>
       </div>
      ))}
      <button onClick={e => addCharacter()}>Add New Character</button>
      <button onClick={e => sendLeaderboardData()}>Submit</button>
    </>
   )
};
  
  export default CreateLeaderboardPage;