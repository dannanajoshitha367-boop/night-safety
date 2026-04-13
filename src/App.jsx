import React, { useState, useEffect } from 'react';
import './App.css';
import SituationForm from './components/SituationForm';
import SafetyGuidance from './components/SafetyGuidance';
import SoundDetection from './components/SoundDetection';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmergencyActions from './components/EmergencyActions';
import { safetyAPI } from './api';

function App() {
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [safetyTips, setSafetyTips] = useState([]);
  const [emergencyNumbers, setEmergencyNumbers] = useState({});
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    // Check API connection and fetch initial data
    const initializePage = async () => {
      const healthCheck = await safetyAPI.healthCheck();
      if (healthCheck) {
        setApiConnected(true);
        const tipsResponse = await safetyAPI.getSafetyTips();
        const numbersResponse = await safetyAPI.getEmergencyNumbers();
        
        // Extract data from nested responses
        if (tipsResponse.safety_tips) {
          setSafetyTips(tipsResponse.safety_tips);
        }
        if (numbersResponse.emergency_numbers) {
          setEmergencyNumbers(numbersResponse.emergency_numbers);
        }
      }
    };
    initializePage();
  }, []);

  const handleGenerateGuidance = async (situation) => {
    setLoading(true);
    setError(null);
    const result = await safetyAPI.generateGuidance(situation);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setGuidance(null);
    } else {
      // Extract guidance from response (it's nested under .guidance key)
      setGuidance(result.guidance || result);
      setError(null);
    }
  };

  return (
    <div className="App">
      <Header apiConnected={apiConnected} />
      <div className="app-container">
        <Sidebar safetyTips={safetyTips} emergencyNumbers={emergencyNumbers} />
        <main className="main-content">
          <SituationForm onSubmit={handleGenerateGuidance} loading={loading} />
          {error && <div className="error-message">❌ {error}</div>}
          {guidance && <SafetyGuidance guidance={guidance} />}
          <SoundDetection />
          <EmergencyActions emergencyNumbers={emergencyNumbers} />
        </main>
      </div>
    </div>
  );
}

export default App;
