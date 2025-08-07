import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreatePoll from './pages/CreatePoll';
import Vote from './pages/Vote';
import PrivacyPolicy from './pages/PrivacyPolicy'; // 새로 만든 페이지를 불러옵니다.
import './App.css';

function App() {
  return (
    <div className="app-container">
      <main className="poll-box">
        <Routes>
          <Route path="/" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<Vote />} />
          <Route path="/privacy" element={<PrivacyPolicy />} /> {/* 새 경로를 추가합니다. */}
        </Routes>
      </main>
      
      {/* 모든 페이지 하단에 표시될 푸터 */}
      <footer className="app-footer">
        <Link to="/privacy">개인정보 처리방침</Link>
      </footer>
    </div>
  );
}

export default App;
