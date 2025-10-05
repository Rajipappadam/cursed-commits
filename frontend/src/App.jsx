import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [status, setStatus] = useState('Checking...');
  const [apiStatus, setApiStatus] = useState('Checking...');

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const { error } = await supabase.from('users').select('count');
        if (error) throw error;
        setStatus('✅ Connected to Supabase!');
      } catch (error) {
        setStatus('❌ Error: ' + error.message);
      }
    };

    const checkAPI = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        const data = await response.json();
        setApiStatus('✅ ' + data.message);
      } catch (error) {
        setApiStatus('❌ Backend not running');
      }
    };

    checkSupabase();
    checkAPI();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">🎮 Cursed Commits</h1>
        <p className="subtitle">Day 1 Setup</p>
        
        <div className="status-card">
          <h2>System Status</h2>
          <div className="status-item">
            <span>Supabase:</span>
            <span>{status}</span>
          </div>
          <div className="status-item">
            <span>Backend API:</span>
            <span>{apiStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;