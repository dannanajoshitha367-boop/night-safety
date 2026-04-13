import axios from 'axios';

// Dynamically construct API URL based on current hostname
const getAPIUrl = () => {
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname; // localhost, IP address, etc.
  const baseUrl = `${protocol}//${hostname}:8001`;
  return baseUrl;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getAPIUrl();
const SOUND_DETECTION_URL = process.env.REACT_APP_SOUND_DETECTION_URL || getAPIUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate axios instance for sound detection (handles multipart/form-data)
const soundDetectionAPI_axios = axios.create({
  baseURL: SOUND_DETECTION_URL,
  timeout: 30000,
});

export const safetyAPI = {
  generateGuidance: async (situation) => {
    try {
      const response = await api.post('/api/guidance', {
        situation: situation,
      });
      return response.data;
    } catch (error) {
      return {
        error: error.response?.data?.detail || error.message || 'Failed to generate guidance',
      };
    }
  },

  getEmergencyNumbers: async () => {
    try {
      const response = await api.get('/api/emergency-numbers');
      return response.data;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },

  getSafetyTips: async () => {
    try {
      const response = await api.get('/api/safety-tips');
      return response.data;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },

  healthCheck: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export const soundDetectionAPI = {
  // Check if sound detection backend is healthy
  checkHealth: async () => {
    try {
      const response = await soundDetectionAPI_axios.get('/health', { timeout: 5000 });
      return response.data.status === 'ok';
    } catch (error) {
      console.log('Sound detection backend unreachable:', error.message);
      return false;
    }
  },

  // Detect dangerous sounds in uploaded audio file
  detectSound: async (audioFile) => {
    try {
      const formData = new FormData();
      formData.append('file', audioFile);

      const response = await soundDetectionAPI_axios.post('/detect-sound', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      return response.data;
    } catch (error) {
      return {
        error:
          error.response?.data?.detail ||
          error.message ||
          'Failed to analyze audio. Make sure the backend is running.',
      };
    }
  },

  // Trigger emergency SOS alert
  triggerSOS: async (sosData) => {
    try {
      const response = await soundDetectionAPI_axios.post('/emergency-sos', sosData);
      return response.data;
    } catch (error) {
      return {
        error: error.response?.data?.detail || error.message || 'Failed to send SOS alert.',
      };
    }
  },

  // Get list of supported dangerous sounds
  getSupportedSounds: async () => {
    try {
      const response = await soundDetectionAPI_axios.get('/supported-sounds');
      return response.data;
    } catch (error) {
      console.log('Failed to fetch supported sounds:', error.message);
      return null;
    }
  },

  // Batch detect multiple audio files
  batchDetect: async (audioFiles) => {
    try {
      const formData = new FormData();
      audioFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await soundDetectionAPI_axios.post('/batch-detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });
      return response.data;
    } catch (error) {
      return {
        error:
          error.response?.data?.detail ||
          error.message ||
          'Failed to analyze audio files. Make sure the backend is running.',
      };
    }
  },
};

export default api;
