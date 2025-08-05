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

  // [스타일 정의] 이전의 심플한 인라인 스타일로 복귀합니다.
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
    },
    formBox: {
      width: '100%',
      maxWidth: '400px',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      boxSizing: 'border-box',
      background: '#333',
      border: '1px solid #555',
      color: 'white',
      borderRadius: '5px',
    },
    button: {
      width: '100%',
      padding: '12px',
      cursor: 'pointer',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h1 style={{ textAlign: 'center' }}>A or B</h1>
        <input
          style={styles.input}
          type="text"
          placeholder="투표 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="옵션 A"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="옵션 B"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleCreatePoll}
          disabled={loading}
        >
          {loading ? '만드는 중...' : '투표 만들기'}
        </button>
      </div>
    </div>
  );
}

export default CreatePoll;
