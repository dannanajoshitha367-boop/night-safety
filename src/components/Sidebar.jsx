import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ safetyTips, emergencyNumbers }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2>📋 About This App</h2>
        <p className="info-box">
          This app provides instant safety guidance powered by AI. It analyzes your situation
          and gives practical advice on what to do.
        </p>
        <p className="disclaimer">
          <strong>⚠️ Note:</strong> This is not a replacement for emergency services.
        </p>
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-section">
        <h2>🚨 Emergency Numbers</h2>
        <div className="emergency-numbers">
          {emergencyNumbers.police && (
            <div className="number-item">
              <span className="label">Police</span>
              <span className="number">{emergencyNumbers.police}</span>
            </div>
          )}
          {emergencyNumbers.ambulance && (
            <div className="number-item">
              <span className="label">Ambulance</span>
              <span className="number">{emergencyNumbers.ambulance}</span>
            </div>
          )}
          {emergencyNumbers.fire && (
            <div className="number-item">
              <span className="label">Fire</span>
              <span className="number">{emergencyNumbers.fire}</span>
            </div>
          )}
          {emergencyNumbers.women_helpline && (
            <div className="number-item">
              <span className="label">Women Helpline</span>
              <span className="number">{emergencyNumbers.women_helpline}</span>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-section">
        <h2>💡 Safety Tips</h2>
        <ul className="tips-list">
          {safetyTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
