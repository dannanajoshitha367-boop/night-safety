import React, { useState, useRef, useEffect } from 'react';
import '../styles/SoundDetection.css';

function SoundDetection() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [volume, setVolume] = useState(0);
  const [peakVolume, setPeakVolume] = useState(0);
  const [averageVolume, setAverageVolume] = useState(0);
  const [isAlert, setIsAlert] = useState(false);
  const [error, setError] = useState(null);
  const [frequencyBars, setFrequencyBars] = useState([]);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationIdRef = useRef(null);
  const volumeHistoryRef = useRef([]);
  const isMonitoringRef = useRef(false);
  const peakVolumeRef = useRef(0);

  const THRESHOLD = 40;
  const HISTORY_SIZE = 30;

  const playAlertSound = () => {
    try {
      if (!audioContextRef.current) return;
      
      const now = audioContextRef.current.currentTime;
      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();

      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);

      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (err) {
      console.log('Alert sound not available');
    }
  };

  const analyze = () => {
    if (!isMonitoringRef.current || !analyserRef.current) {
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const currentVolume = Math.min(100, (rms / 128) * 100);

    // Update history
    volumeHistoryRef.current.push(currentVolume);
    if (volumeHistoryRef.current.length > HISTORY_SIZE) {
      volumeHistoryRef.current.shift();
    }

    // Calculate statistics
    const average =
      volumeHistoryRef.current.reduce((a, b) => a + b, 0) /
      volumeHistoryRef.current.length;
    
    if (currentVolume > peakVolumeRef.current) {
      peakVolumeRef.current = currentVolume;
      setPeakVolume(Math.round(peakVolumeRef.current));
    }

    // Update display
    setVolume(Math.round(currentVolume));
    setAverageVolume(Math.round(average));

    // Update frequency bars
    const barCount = 15;
    const bars = [];
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * dataArray.length);
      const value = dataArray[dataIndex] / 255;
      bars.push(value * 100);
    }
    setFrequencyBars(bars);

    // Check threshold
    const alertTriggered = currentVolume > THRESHOLD;
    setIsAlert(alertTriggered);

    if (alertTriggered) {
      playAlertSound();
    }

    animationIdRef.current = requestAnimationFrame(analyze);
  };

  const startMonitoring = async () => {
    try {
      setError(null);
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('❌ Microphone not supported. Please use a modern browser (Chrome, Firefox, Safari on iOS 14.5+)');
        return;
      }
      
      // Initialize audio context
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
          setError('❌ Web Audio API not supported. Please use a modern browser.');
          return;
        }
        audioContextRef.current = new AudioContext();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Request microphone with proper fallback
      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Create audio nodes
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 2048;
      microphone.connect(analyser);

      microphoneRef.current = microphone;
      analyserRef.current = analyser;
      
      isMonitoringRef.current = true;
      setIsMonitoring(true);
      
      // Start analysis
      analyze();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('❌ Microphone permission denied. Please allow microphone access.');
      } else if (err.name === 'NotFoundError') {
        setError('❌ No microphone found. Please connect a microphone.');
      } else {
        setError(`❌ Error: ${err.message}`);
      }
    }
  };

  const stopMonitoring = () => {
    isMonitoringRef.current = false;
    setIsMonitoring(false);
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      if (microphoneRef.current.mediaStream) {
        microphoneRef.current.mediaStream.getTracks().forEach((track) => track.stop());
      }
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    // Reset UI
    setVolume(0);
    setAverageVolume(0);
    setPeakVolume(0);
    peakVolumeRef.current = 0;
    setIsAlert(false);
    setFrequencyBars([]);
    volumeHistoryRef.current = [];
  };

  useEffect(() => {
    return () => {
      if (isMonitoringRef.current) {
        stopMonitoring();
      }
    };
  }, []);

  return (
    <div className="sound-detection">
      <h2>🎙️ Real-Time Sound Detector</h2>
      
      <div className={`sound-status ${isAlert ? 'alert' : 'safe'}`}>
        <div className="status-emoji">{isAlert ? '🚨' : '🔒'}</div>
        <div className="status-text">
          {isAlert ? '⚠️ ALERT! HIGH SOUND DETECTED' : '✅ Monitoring Safe Environment'}
        </div>
      </div>

      <div className="sound-volume-section">
        <div className="volume-info">
          <span className="volume-label">Current Volume Level</span>
          <div className={`volume-bar ${isAlert ? 'alert' : ''}`}>
            <div className="volume-fill" style={{ width: `${volume}%` }}></div>
            <span className="volume-text">{volume}</span>
          </div>
          <div className="threshold-info">Threshold: <strong>40 dB</strong></div>
        </div>

        <div className="sound-stats">
          <div className="stat">
            <div className="stat-label">Current</div>
            <div className="stat-value">{volume}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Peak</div>
            <div className="stat-value">{Math.round(peakVolume)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Average</div>
            <div className="stat-value">{averageVolume}</div>
          </div>
        </div>
      </div>

      <div className="frequency-visualization">
        <div className="frequency-bars">
          {frequencyBars.map((bar, index) => (
            <div
              key={index}
              className={`bar ${isAlert ? 'alert' : ''}`}
              style={{ height: `${bar}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="sound-controls">
        <button
          className="btn btn-start"
          onClick={startMonitoring}
          disabled={isMonitoring}
        >
          🎙️ Start Monitoring
        </button>
        <button
          className="btn btn-stop"
          onClick={stopMonitoring}
          disabled={!isMonitoring}
        >
          ⏹️ Stop
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="sound-info">
        <p>
          👂 Click "Start Monitoring" to begin real-time sound detection. Any loud sound 
          above 40 dB will trigger an alert with visual and audio feedback.
        </p>
      </div>
    </div>
  );
}

export default SoundDetection;
