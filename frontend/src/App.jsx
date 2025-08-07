import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreatePoll from './pages/CreatePoll';
import Vote from './pages/Vote';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <main className="poll-box">
        <Routes>
          <Route path="/" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<Vote />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      
      <footer className="app-footer">
        <Link to="/privacy">개인정보 처리방침</Link>
      </footer>
    </div>
  );
}

export default App;
