import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState, useRef} from 'react';

function App() {
const [data, setData] = useState(null)
  const getAkkang1 = () => {
    fetch(
			`http://localhost:3001/top3`
			,
			{
				method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                  },
				body: JSON.stringify(
                {
                        raid: "Ivory_G3_Hard",
                        mains: true
                }),
			})
			.then((response) => response.json()
			)
			.then((result) => {	
				console.log(result);
        setData(result)
			})
			.catch((error) => {
				console.error('Error:', error);
			});
    }
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={e => getAkkang1()}></button>
        <p>{data == null ? "N/A" : data[0].player+ ","+ data[0].dps}</p>
        <p>{data == null ? "N/A" : data[1].player+ ","+ data[1].dps}</p>
        <p>{data == null ? "N/A" : data[2].player+ ","+ data[2].dps}</p>
      </header>
    </div>
  );
}

export default App;
