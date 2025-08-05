import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePoll from './pages/CreatePoll';
import Vote from './pages/Vote';
import './App.css'; // App.css를 여기서 한 번만 불러옵니다.

function App() {
  return (
    // 모든 페이지를 이 중앙 정렬 컨테이너로 감싸줍니다.
    <div className="app-container">
      <main className="poll-box">
        <Routes>
          <Route path="/" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<Vote />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
