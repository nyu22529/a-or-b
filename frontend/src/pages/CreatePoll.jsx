import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// 기존 App.jsx에 있던 투표 생성 폼 로직 전체를
// CreatePoll이라는 컴포넌트로 옮겨왔습니다.
function CreatePoll() {
  const [title, setTitle] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePoll = async () => {
    if (!title || !optionA || !optionB) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('polls')
        .insert([
          { title: title, option_a_text: optionA, option_b_text: optionB }
        ]);

      if (error) {
        throw error;
      }

      alert('🎉 투표가 성공적으로 만들어졌습니다!');
      setTitle('');
      setOptionA('');
      setOptionB('');

    } catch (error) {
      alert('투표 생성 중 오류가 발생했습니다.');
      console.error('Error creating poll:', error);
    } finally {
      setLoading(false);
    }
  };

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
        disabled={loading}
        style={{ width: '100%', padding: '12px', cursor: 'pointer', backgroundColor: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}
      >
        {loading ? '만드는 중...' : '투표 만들기'}
      </button>
    </div>
  );
}

export default CreatePoll;
