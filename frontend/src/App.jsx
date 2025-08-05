import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePoll from './pages/CreatePoll'; // 우리가 만든 페이지를 불러옵니다.

// 임시로 만들 투표 페이지와 결과 페이지 (아직 파일은 없음)
// const Vote = () => <div>투표하는 페이지입니다.</div>;
// const Results = () => <div>투표 결과 페이지입니다.</div>;

function App() {
  return (
    <Routes>
      {/* 기본 주소('/')로 접속하면 CreatePoll 페이지를 보여줍니다. */}
      <Route path="/" element={<CreatePoll />} />
      
      {/* '/poll/:id' 주소로 접속하면 Vote 페이지를 보여줍니다. (나중에 구현) */}
      {/* <Route path="/poll/:id" element={<Vote />} /> */}

      {/* '/results/:id' 주소로 접속하면 Results 페이지를 보여줍니다. (나중에 구현) */}
      {/* <Route path="/results/:id" element={<Results />} /> */}
    </Routes>
  );
}

export default App;
