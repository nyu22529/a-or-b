import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePoll from './pages/CreatePoll';
import Vote from './pages/Vote'; // Vote 페이지를 새로 불러옵니다.

// const Results = () => <div>투표 결과 페이지입니다.</div>; // 이건 아직 안 만들었으니 그대로 둡니다.

function App() {
  return (
    <Routes>
      {/* 기본 주소('/')로 접속하면 CreatePoll 페이지를 보여줍니다. */}
      <Route path="/" element={<CreatePoll />} />
      
      {/* '/poll/:id' 주소로 접속하면 Vote 페이지를 보여줍니다. */}
      {/* :id 부분은 어떤 투표인지를 구별하는 고유 번호가 됩니다. */}
      <Route path="/poll/:id" element={<Vote />} />

      {/* '/results/:id' 주소로 접속하면 Results 페이지를 보여줍니다. (나중에 구현) */}
      {/* <Route path="/results/:id" element={<Results />} /> */}
    </Routes>
  );
}

export default App;
