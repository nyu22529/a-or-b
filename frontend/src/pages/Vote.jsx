import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Vote() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVoted, setIsVoted] = useState(false); // [신규] 사용자의 투표 여부를 기억하는 state

  useEffect(() => {
    // 페이지가 로드될 때, localStorage를 확인해서 이미 투표했는지 체크합니다.
    const checkVotedStatus = () => {
      const voted = localStorage.getItem('voted_poll_' + id);
      if (voted) {
        setIsVoted(true);
      }
    };
    
    checkVotedStatus();

    const fetchPoll = async () => {
      // ... (데이터 로딩 로직은 기존과 동일) ...
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

  // [수정] handleVote 함수에 localStorage 로직 추가
  const handleVote = async (option) => {
    // 1. localStorage를 확인하여 이미 투표했는지 검사합니다.
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
      
      // 2. Supabase 업데이트 성공 시, localStorage에 기록을 남깁니다.
      localStorage.setItem('voted_poll_' + id, 'true');
      setIsVoted(true); // 화면의 버튼을 비활성화하기 위해 state 업데이트
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
        {/* isVoted 상태에 따라 버튼을 비활성화합니다. */}
        <button className="poll-button" onClick={() => handleVote('A')} disabled={isVoted}>
          {poll.option_a_text} 투표
        </button>
        <button className="poll-button" onClick={() => handleVote('B')} disabled={isVoted}>
          {poll.option_b_text} 투표
        </button>
      </div>
      
      {/* isVoted가 true일 때, 투표 완료 메시지를 보여줍니다. */}
      {isVoted && <p className="voted-message">투표에 참여해주셔서 감사합니다!</p>}

      <div className="bottom-buttons-container">
        <button className="poll-button copy" onClick={handleCopyLink}>🔗 링크 복사</button>
        <Link to="/" className="poll-button home">🏠 새 투표 만들기</Link>
      </div>
    </>
  );
}

export default Vote;
