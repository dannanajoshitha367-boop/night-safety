import React, { useState } from 'react';
import '../styles/EmergencyActions.css';

function EmergencyActions({ emergencyNumbers }) {
  const [showContactInput, setShowContactInput] = useState(false);
  const [contactPhone, setContactPhone] = useState('');

  const handleCallPolice = () => {
    alert(
      `📞 To call police: Dial ${emergencyNumbers.police || '100'} (India)\nor 911 (USA/Canada)`
    );
  };

  const handleEmergencyContact = () => {
    if (!contactPhone.trim()) {
      alert('Please enter an emergency contact number first.');
      return;
    }
    alert(`📞 Call your emergency contact at: ${contactPhone}`);
  };

  return (
    <section className="emergency-actions">
      <h2>🆘 Emergency Actions</h2>
      <div className="action-buttons">
        <button className="btn-danger" onClick={handleCallPolice}>
          ☎️ Call Police ({emergencyNumbers.police || '100'})
        </button>

        <div className="contact-input-group">
          <input
            type="tel"
            placeholder="Enter emergency contact number"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <button className="btn-danger" onClick={handleEmergencyContact}>
            💬 Contact
          </button>
        </div>
      </div>

      <div className="info-box">
        💡 Keep your phone charged and location services enabled
      </div>

      <footer className="footer">
        <p>
          <strong>⚠️ Disclaimer:</strong> This app provides guidance only and is not a
          substitute for professional emergency services. In life-threatening situations,
          always call emergency services immediately.
        </p>
        <p>🔒 Your situation is processed by AI but is not stored or shared.</p>
      </footer>
    </section>
  );
}

export default EmergencyActions;
