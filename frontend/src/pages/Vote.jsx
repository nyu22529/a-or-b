import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Vote() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReported, setIsReported] = useState(false); // 신고 상태 관리

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select('*')
          .eq('id', id)
          .eq('is_deleted', false) // [수정] is_deleted가 false인 것만 가져옵니다.
          .single();

        if (error) {
          // 데이터가 없는 경우(null)도 에러로 취급될 수 있으므로,
          // 명시적으로 데이터가 없을 때의 메시지를 설정합니다.
          if (!data) {
            setError('만료되었거나 찾을 수 없는 투표입니다.');
          } else {
            throw error;
          }
        }
        
        if (data) {
          setPoll(data);
        } else {
          // 데이터가 없는 경우 여기서도 한 번 더 확인
          setError('만료되었거나 찾을 수 없는 투표입니다.');
        }

      } catch (error) {
        setError('투표 정보를 불러오는 데 실패했습니다.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  const handleVote = async (option) => {
    // ... (기존과 동일한 로직) ...
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
    // ... (기존과 동일한 로직) ...
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('✅ 링크가 복사되었습니다!'))
      .catch(() => alert('링크 복사에 실패했습니다.'));
  };

  // [신규] 신고 기능 함수
  const handleReport = async () => {
    if (isReported) {
      alert('이미 신고 처리되었습니다.');
      return;
    }
    const confirmReport = window.confirm('정말로 이 투표를 신고하시겠습니까?');
    if (confirmReport) {
      try {
        const { error } = await supabase.from('reports').insert([{ poll_id: id }]);
        if (error) throw error;
        alert('신고가 접수되었습니다.');
        setIsReported(true); // 신고 버튼 비활성화를 위해 상태 변경
      } catch (error) {
        alert('신고 처리 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) return <>로딩 중...</>;
  // [수정] 에러 메시지를 우선적으로 표시합니다.
  if (error) return <h2 className="error-message">{error}</h2>;
  if (!poll) return <h2 className="error-message">만료되었거나 찾을 수 없는 투표입니다.</h2>;

  const totalVotes = poll.option_a_votes + poll.option_b_votes;
  const optionAPercentage = totalVotes === 0 ? 50 : (poll.option_a_votes / totalVotes) * 100;
  const optionBPercentage = totalVotes === 0 ? 50 : (poll.option_b_votes / totalVotes) * 100;

  return (
    <>
      <h1 className="poll-title">{poll.title}</h1>
      
      <div className="result-visualizer">
        {/* ... (기존과 동일한 UI) ... */}
        <div className="option-pane option-a" style={{ width: `${optionAPercentage}%` }}>
          <span className="option-text">{poll.option_a_text}</span>
          <span className="vote-count">{poll.option_a_votes}표 ({optionAPercentage.toFixed(1)}%)</span>
        </div>
        <div className="option-pane option-b" style={{ width: `${optionBPercentage}%` }}>
          <span className="option-text">{poll.option_b_text}</span>
          <span className="vote-count">{poll.option_b_votes}표 ({optionBPercentage.toFixed(1)}%)</span>
        </div>
      </div>

      <div className="vote-buttons-container">
        <button className="poll-button" onClick={() => handleVote('A')}>{poll.option_a_text} 투표</button>
        <button className="poll-button" onClick={() => handleVote('B')}>{poll.option_b_text} 투표</button>
      </div>

      <button className="poll-button copy" onClick={handleCopyLink}>🔗 링크 복사</button>
      
      {/* 신고 버튼과 정책 고지 문구 추가 */}
      <div className="bottom-controls">
        <p className="policy-notice small">※ 이 투표는 24시간 후 만료됩니다.</p>
        <button className="report-button" onClick={handleReport} disabled={isReported}>
          {isReported ? '신고됨' : '🚨 이 투표 신고하기'}
        </button>
      </div>
    </>
  );
}

export default Vote;
