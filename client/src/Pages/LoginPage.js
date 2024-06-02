import React, { useState } from 'react';
import {useAuth} from '../Auth/AuthContext'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/profile');
    } catch (err) {
      if(err.response.data.message === 'No user with that username' || err.response.data.message === 'Password incorrect'){
        alert('Incorrect username or password.')
      }else{
        alert(err.response.data.message)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className='whiteText'>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input className='whiteText' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
