import React, { useState } from 'react';
// useNavigate를 react-router-dom에서 가져옵니다.
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function CreatePoll() {
  // useNavigate 훅을 호출해서 페이지 이동 함수를 준비합니다.
  const navigate = useNavigate(); 
  
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
      
      // [핵심 변경점!]
      // 데이터를 insert한 후, .select().single()을 추가해서
      // 방금 생성된 데이터(특히 id)를 반환받습니다.
      const { data, error } = await supabase
        .from('polls')
        .insert([
          { title: title, option_a_text: optionA, option_b_text: optionB }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 성공했다면, 반환받은 데이터의 id를 이용해서 페이지를 이동시킵니다!
      if (data) {
        alert('🎉 투표가 성공적으로 만들어졌습니다! 결과 페이지로 이동합니다.');
        navigate(`/poll/${data.id}`);
      }

    } catch (error) {
      alert('투표 생성 중 오류가 발생했습니다.');
      console.error('Error creating poll:', error);
    } finally {
      setLoading(false);
    }
  };

  // UI 부분은 이전과 동일합니다.
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
