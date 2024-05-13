import React, { useState } from 'react';
import './AddRoster.css'

const AddRoster = ({}) => {
    const [inputs, setInputs] = useState([{ text: '', checked: false }]);

    const addInput = () => {
      setInputs([...inputs, { text: '', checked: false }]);
    };
  
    const handleInputChange = (index, event) => {
      const { name, value } = event.target;
      const newInputs = [...inputs];
      newInputs[index][name] = value;
      setInputs(newInputs);
    };
  
    const handleCheckboxChange = (index) => {
      const newInputs = [...inputs];
      newInputs[index].checked = !newInputs[index].checked;
      setInputs(newInputs);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      
    };
  
    return (
      <div>   
        <p className='text'>Check if character is main</p>
        <form onSubmit={handleSubmit}>
          {inputs.map((input, index) => (
            <div key={index}>
              <input
                type="text"
                name="name"
                placeholder='Character Name'
                value={input.text}
                onChange={(event) => handleInputChange(index, event)}
              />
              <input
                type="checkbox"
                name="main"
                checked={input.checked}
                onChange={() => handleCheckboxChange(index)}
              />
            </div>
          ))}
          <button type="button" onClick={addInput}>+</button>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
  
export default AddRoster;
