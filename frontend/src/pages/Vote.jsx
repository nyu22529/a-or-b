import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Vote() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... (기존과 동일한 로직) ...
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
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('✅ 링크가 복사되었습니다!'))
      .catch(() => alert('링크 복사에 실패했습니다.'));
  };

  if (loading) return <>로딩 중...</>;
  if (error) return <>{error}</>;
  if (!poll) return <>해당 투표를 찾을 수 없습니다.</>;

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
        <button className="poll-button" onClick={() => handleVote('A')}>
          {poll.option_a_text} 투표
        </button>
        <button className="poll-button" onClick={() => handleVote('B')}>
          {poll.option_b_text} 투표
        </button>
      </div>

      <button className="poll-button copy" onClick={handleCopyLink}>🔗 링크 복사</button>
    </>
  );
}

export default Vote;
