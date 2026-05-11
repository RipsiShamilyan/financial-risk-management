// src/components/Login.jsx
import React, { useState } from 'react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const Login = ({ onLogin }) => { // Ստեղծում ենք onLogin պրոֆիլը
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userId', data.user_id); // Պահպանեք userId-ը localStorage-ում
        setSuccess(data.message);
        onLogin(data.user_id); // Փոխանցեք user_id այստեղ
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Սխալ մուտքի ժամանակ');
    }
  };

  return (
    <div className="login-container">
      <h2>Մուտք գործել</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Էլ-փոստ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Գաղտնաբառ"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Մուտք գործել</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Login;
