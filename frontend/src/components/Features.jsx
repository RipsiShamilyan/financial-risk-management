import React from 'react';
import '../css/Features.css';
import { useNavigate } from 'react-router-dom';

const Features = () => {
    const navigate = useNavigate();

    const handleHome = () => {
      navigate('/');
    };
  return (
    <div className="features-container">
      <header className="features-header">
        <h1 className="features-title">Կայքի հիմնական գործառույթները</h1>
        <ul className="features-list">
          <li className="features-item">Բյուջեի Հաշվարկ</li>
          <li className="features-item">Ռիսկի կառավարում</li>
          <li className="features-item">Վարկի ռիսկի վերլուծություն</li>
          <li className="features-item">Աշխատավարձի հաշվիչ</li>
          <li className="features-item">Վարկային հաշվիչ</li>
        </ul>
        <button className="home-button" onClick={handleHome}>
        Հետ գնալ
        </button>
      </header>
    </div>
  );
};

export default Features;
