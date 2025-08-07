import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Vote() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVoted, setIsVoted] = useState(false);
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    const checkVotedStatus = () => {
      const voted = localStorage.getItem('voted_poll_' + id);
      if (voted) {
        setIsVoted(true);
      }
    };
    
    checkVotedStatus();

    const fetchPoll = async () => {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select('*')
          .eq('id', id)
          .eq('is_deleted', false)
          .single();

        if (error) {
          if (!data) {
            setError('만료되었거나 찾을 수 없는 투표입니다.');
          } else {
            throw error;
          }
        }
        
        if (data) {
          setPoll(data);
        } else {
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
    if (localStorage.getItem('voted_poll_' + id)) {
      alert('이미 투표에 참여하셨습니다.');
      return;
    }

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
      
      localStorage.setItem('voted_poll_' + id, 'true');
      setIsVoted(true);
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

  const handleReport = async () => {
    if (isReported) {
      alert('이미 신고 처리되었습니다.');
      return;
    }
    const confirmReport = window.confirm('정말로 이 투표를 신고하시겠습니까? 부적절한 투표는 관리자 확인 후 삭제될 수 있습니다.');
    if (confirmReport) {
      try {
        const { error } = await supabase.from('reports').insert([{ poll_id: id }]);
        if (error) throw error;
        alert('신고가 접수되었습니다.');
        setIsReported(true);
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
        <button className="poll-button" onClick={() => handleVote('A')} disabled={isVoted}>
          {poll.option_a_text} 투표
        </button>
        <button className="poll-button" onClick={() => handleVote('B')} disabled={isVoted}>
          {poll.option_b_text} 투표
        </button>
      </div>
      
      {isVoted && <p className="voted-message">투표에 참여해주셔서 감사합니다!</p>}

      <div className="bottom-buttons-container">
        <button className="poll-button copy" onClick={handleCopyLink}>🔗 링크 복사</button>
        <Link to="/" className="poll-button home">🏠 새 투표 만들기</Link>
      </div>
      
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
