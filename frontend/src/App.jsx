import React, { useState } from 'react';

// 2단계에서 만들 supabaseClient.js 파일을 불러올 부분입니다.
// 아직 이 파일이 없으므로, 지금은 이 코드를 주석 처리해 두어야 오류가 나지 않습니다.
// import { supabase } from './supabaseClient';

function App() {
  // 각 입력 필드의 내용을 저장하기 위한 '기억 상자(state)'들입니다.
  const [title, setTitle] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');

  // '투표 만들기' 버튼을 눌렀을 때 실행될 함수 (지금은 비어있음)
  const handleCreatePoll = () => {
    // 나중에 여기에 Supabase로 데이터를 보내는 코드를 넣을 겁니다.
    alert('UI 테스트 성공! 아직 데이터 전송 기능은 없어요.');
  };

  // 화면에 보여질 UI 부분 (HTML과 비슷합니다)
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>A or B</h1>
      <p style={{ textAlign: 'center', color: '#555' }}>새로운 투표 만들기</p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>투표 제목</label>
        <input
          type="text"
          placeholder="예: 점심 메뉴 추천"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: 'calc(100% - 16px)', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>옵션 A</label>
        <input
          type="text"
          placeholder="예: 김치찌개"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
          style={{ width: 'calc(100% - 16px)', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>옵션 B</label>
        <input
          type="text"
          placeholder="예: 된장찌개"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
          style={{ width: 'calc(100% - 16px)', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <button
        onClick={handleCreatePoll}
        style={{ width: '100%', padding: '12px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}
      >
        투표 만들기
      </button>
    </div>
  );
}

export default App;