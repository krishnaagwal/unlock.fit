import React from 'react';
import '../public/styles/main.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Unlock.fit Weight Tracker</h1>
      <div className="navbar">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
