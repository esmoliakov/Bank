import React from 'react';
import Logo from '../assets/logo.png';
import '../styles/StartPage.css';

const StartPage: React.FC = () => {
  return (
    <div className="start-page">
      <header>
        <img src={Logo} alt="Bank Logo" className="logo" />
        <h1>Welcome to MyBank</h1>
        <p>Your trusted online banking solution</p>
      </header>

      <section className="actions">
        <button onClick={() => alert('Go to Login')}>Login</button>
        <button onClick={() => alert('Go to Register')}>Register</button>
      </section>
    </div>
  );
};

export default StartPage;
