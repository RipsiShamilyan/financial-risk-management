import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Features from './components/Features';
import Budgeting from './components/Budgeting';
import Profile from './components/Profile';
import SalaryCalculator from './components/SalaryCalculator';
import LoanCalculator from './components/LoanCalculator';
import ChatBot from './components/ChatBot';
import RiskAssessment from './components/RiskAssessment';
import LoanRiskAnalysis from './components/LoanRiskAnalysis';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId');
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const handleLogin = (user_id) => {
    setIsLoggedIn(true);
    setUserId(user_id);
    localStorage.setItem('userId', user_id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="5" fill="#263349" />
            <text x="50%" y="50%" fontSize="40" textAnchor="middle" dy=".3em" fill="white">
              RS
            </text>
          </svg>
          <h1 className="riskSnap">RiskSnap</h1>
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={isMenuOpen ? 'show' : ''}>
          <li><Link to="/">Գլխավոր</Link></li>
          {!isLoggedIn ? (
            <>
              <li><Link to="/login">Մուտք </Link></li>
              <li><Link to="/register">Գրանցվել</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/profile">Պրոֆիլ</Link></li>
              <li><Link to="/budgeting">Բյուջե</Link></li>
              <li><Link to="/risk-assessment">Ռիսկի կառավարում</Link></li>
              <li><Link to="/loan-risk">Վարկի ռիսկի վերլուծություն</Link></li>
              <li><Link to="/calculate-salary">Աշխատավարձի հաշվիչ</Link></li>
              <li><Link to="/calculate-loan">Վարկային հաշվիչ</Link></li>
              <li><button onClick={handleLogout} className='logOut'>Դուրս գալ</button></li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        {isLoggedIn && <Route path="/budgeting" element={<Budgeting userId={userId} />} />}
        <Route path="/profile" element={<Profile />} />
        <Route path="/calculate-salary" element={<SalaryCalculator />} />
        <Route path="/calculate-loan" element={<LoanCalculator userId={userId} />} />
        <Route path="/risk-assessment" element={<RiskAssessment userId={userId} />} />
        <Route path="/loan-risk" element={<LoanRiskAnalysis />} />
      </Routes>
      <ChatBot />
    </div>
  );
};

export default App;
