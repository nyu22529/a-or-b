import React, { useState } from 'react';
// 이제 이 연결 통로를 실제로 사용할 시간입니다! 주석을 풀어주세요.
import { supabase } from './supabaseClient';

function App() {
  // 각 입력 필드의 내용을 저장하기 위한 '기억 상자(state)'들
  const [title, setTitle] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');

  // 데이터를 전송하는 동안 버튼을 잠시 비활성화하기 위한 state
  const [loading, setLoading] = useState(false);

  // '투표 만들기' 버튼을 눌렀을 때 실행될 함수
  const handleCreatePoll = async () => {
    // 1. 혹시 사용자가 내용을 빼먹었는지 확인
    if (!title || !optionA || !optionB) {
      alert('모든 항목을 입력해주세요.');
      return; // 함수를 여기서 중단
    }

    try {
      setLoading(true); // 로딩 시작! 버튼을 비활성화.
      
      // 2. Supabase의 'polls' 테이블에 데이터를 삽입(insert)합니다.
      // 이 부분이 바로 프론트엔드와 백엔드가 처음으로 대화하는 순간입니다!
      const { error } = await supabase
        .from('polls')
        .insert([
          // 바로 이 부분의 키 이름을 백엔드와 맞춰줍니다!
          { title: title, option_a_text: optionA, option_b_text: optionB }
        ]);

      // 3. 에러가 발생하면...
      if (error) {
        throw error; // 에러를 던져서 아래 catch 블록으로 보냅니다.
      }

      // 4. 성공했다면...
      alert('🎉 투표가 성공적으로 만들어졌습니다!');
      // 입력 필드를 깨끗하게 비워줍니다.
      setTitle('');
      setOptionA('');
      setOptionB('');

    } catch (error) {
      alert('투표 생성 중 오류가 발생했습니다.');
      console.error('Error creating poll:', error);
    } finally {
      // 5. 성공하든 실패하든, 마지막엔 항상 로딩을 끝냅니다.
      setLoading(false);
    }
  };

  // 화면에 보여질 UI 부분
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
        disabled={loading} // loading이 true이면 버튼 비활성화
        style={{ width: '100%', padding: '12px', cursor: 'pointer', backgroundColor: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}
      >
        {loading ? '만드는 중...' : '투표 만들기'}
      </button>
    </div>
  );
}

export default App;
