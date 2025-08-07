import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Vote() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReported, setIsReported] = useState(false); // 신고 상태 관리 state

  useEffect(() => {
    // ... (데이터 로딩 로직은 기존과 동일) ...
    const fetchPoll = async () => {
      try {
        const { data, error } = await supabase.from('polls').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          setPoll(data);
        } else {
          setError('만료되었거나 찾을 수 없는 투표입니다.');
        }
      } catch (error) {
        setError('투표 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  const handleVote = async (option) => {
    // ... (투표하기 로직은 기존과 동일) ...
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
    // ... (링크 복사 로직은 기존과 동일) ...
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('✅ 링크가 복사되었습니다!'))
      .catch(() => alert('링크 복사에 실패했습니다.'));
  };

  // [다시 추가] 신고 기능 함수
  const handleReport = async () => {
    if (isReported) {
      alert('이미 신고 처리되었습니다.');
      return;
    }
    // window.confirm 대신 alert를 사용하여 사용자의 추가 행동을 막습니다.
    const confirmReport = window.confirm('정말로 이 투표를 신고하시겠습니까? 부적절한 투표는 관리자 확인 후 삭제될 수 있습니다.');
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
  if (error) return <h2 className="error-message">{error}</h2>;
  if (!poll) return <h2 className="error-message">만료되었거나 찾을 수 없는 투표입니다.</h2>;

  const totalVotes = poll.option_a_votes + poll.option_b_votes;
  const optionAPercentage = totalVotes === 0 ? 50 : (poll.option_a_votes / totalVotes) * 100;
  const optionBPercentage = totalVotes === 0 ? 50 : (poll.option_b_votes / totalVotes) * 100;

  return (
    <>
      <h1 className="poll-title">{poll.title}</h1>
      
      <div className="result-visualizer">
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

      <div className="bottom-buttons-container">
        <button className="poll-button copy" onClick={handleCopyLink}>🔗 링크 복사</button>
        <Link to="/" className="poll-button home">🏠 새 투표 만들기</Link>
      </div>
      
      {/* [다시 추가] 신고 버튼과 정책 고지 문구 */}
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
