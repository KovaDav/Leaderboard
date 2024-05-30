import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        fetch(
            `http://localhost:3001/auth/register`,
            {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username: username, password: password }),
            })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    navigate('/login')
                    alert('Registered successfully.')
                  }else{
                    alert(result.message)
                  }
            })
            .catch((error) => {
              console.error('Error:', error);
              console.log(error);
            });
      
    } catch (error) {
      console.error('Registration failed:', error);
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
