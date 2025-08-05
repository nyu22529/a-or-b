import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Vote() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const { data, error } = await supabase.from('polls').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) setPoll(data);
      } catch (error) {
        setError('투표 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  const handleVote = async (option) => {
    if (!poll) return;
    const columnToUpdate = option === 'A' ? 'option_a_votes' : 'option_b_votes';
    try {
      const { data, error } = await supabase
        .from('polls')
        .update({ [columnToUpdate]: poll[columnToUpdate] + 1 })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setPoll(data);
    } catch (error) {
      alert('투표 처리 중 오류가 발생했습니다.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('✅ 링크가 복사되었습니다!'))
      .catch(() => alert('링크 복사에 실패했습니다.'));
  };

  // [스타일 정의] 컴포넌트 내부에 스타일을 직접 정의합니다.
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
    },
    pollBox: {
      width: '100%',
      maxWidth: '600px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    // [핵심] 시각적 결과 표시 영역
    resultVisualizer: {
      display: 'flex',
      width: '100%',
      height: '300px',
      borderRadius: '15px',
      overflow: 'hidden',
      margin: '20px 0',
      border: '2px solid white',
    },
    optionPane: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      transition: 'width 0.5s ease-in-out',
      boxSizing: 'border-box',
    },
    optionText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    voteCount: {
      fontSize: '1.2rem',
    },
    // 투표 버튼
    voteButton: {
      padding: '12px 24px',
      fontSize: '1rem',
      margin: '0 10px',
      cursor: 'pointer',
      borderRadius: '8px',
      border: '2px solid white',
      background: 'transparent',
      color: 'white',
      fontWeight: 'bold',
    },
    copyButton: {
      marginTop: '20px',
      padding: '10px 20px',
      background: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    }
  };

  if (loading) return <div style={styles.container}>로딩 중...</div>;
  if (error) return <div style={styles.container}>{error}</div>;
  if (!poll) return <div style={styles.container}>해당 투표를 찾을 수 없습니다.</div>;

  const totalVotes = poll.option_a_votes + poll.option_b_votes;
  const optionAPercentage = totalVotes === 0 ? 50 : (poll.option_a_votes / totalVotes) * 100;
  const optionBPercentage = totalVotes === 0 ? 50 : (poll.option_b_votes / totalVotes) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.pollBox}>
        <h1 style={styles.title}>{poll.title}</h1>
        
        {/* 시각적 결과 표시기 */}
        <div style={styles.resultVisualizer}>
          <div style={{...styles.optionPane, width: `${optionAPercentage}%`, backgroundColor: '#3498db'}}>
            <span style={styles.optionText}>{poll.option_a_text}</span>
            <span style={styles.voteCount}>{poll.option_a_votes}표 ({optionAPercentage.toFixed(1)}%)</span>
          </div>
          <div style={{...styles.optionPane, width: `${optionBPercentage}%`, backgroundColor: '#e74c3c'}}>
            <span style={styles.optionText}>{poll.option_b_text}</span>
            <span style={styles.voteCount}>{poll.option_b_votes}표 ({optionBPercentage.toFixed(1)}%)</span>
          </div>
        </div>

        {/* 투표 버튼 */}
        <div>
          <button style={styles.voteButton} onClick={() => handleVote('A')}>
            {poll.option_a_text} 투표
          </button>
          <button style={styles.voteButton} onClick={() => handleVote('B')}>
            {poll.option_b_text} 투표
          </button>
        </div>

        <button style={styles.copyButton} onClick={handleCopyLink}>🔗 링크 복사</button>
      </div>
    </div>
  );
}

export default Vote;
