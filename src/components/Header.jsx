import React from 'react';
import '../styles/Header.css';

function Header({ apiConnected }) {
  return (
    <header className="safety-header">
      <div className="header-content">
        <h1>🌙 AI Night-Safety Companion</h1>
        <p>Get calm, clear, and practical safety guidance for night-time situations</p>
      </div>
    </header>
  );
}

export default Header;
