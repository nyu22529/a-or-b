import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function CreatePoll() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePoll = async () => {
    // ... (기존과 동일한 로직) ...
    if (!title || !optionA || !optionB) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('polls')
        .insert([{ title: title, option_a_text: optionA, option_b_text: optionB }])
        .select()
        .single();
      if (error) throw error;
      if (data) {
        navigate(`/poll/${data.id}`);
      }
    } catch (error) {
      alert('투표 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>A or B</h1>
      <input
        className="poll-input"
        type="text"
        placeholder="투표 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="poll-input"
        type="text"
        placeholder="옵션 A"
        value={optionA}
        onChange={(e) => setOptionA(e.target.value)}
      />
      <input
        className="poll-input"
        type="text"
        placeholder="옵션 B"
        value={optionB}
        onChange={(e) => setOptionB(e.target.value)}
      />
      <button
        className="poll-button primary"
        onClick={handleCreatePoll}
        disabled={loading}
      >
        {loading ? '만드는 중...' : '투표 만들기'}
      </button>

      {/* 정책 고지 문구 추가 */}
      <div className="policy-notice">
        <p>※ 생성된 투표는 24시간 후 만료됩니다.</p>
        <p>※ 투표 내용에 대한 책임은 생성자 본인에게 있습니다.</p>
      </div>
    </>
  );
}

export default CreatePoll;
