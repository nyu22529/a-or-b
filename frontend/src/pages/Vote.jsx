import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 주소의 ID를 가져오기 위한 도구
import { supabase } from '../supabaseClient'; // Supabase와 대화하기 위한 연결 통로

// 투표 페이지 컴포넌트
function Vote() {
  const { id } = useParams(); // 주소창의 :id 부분(예: /poll/123 -> 123)을 가져옵니다.
  const [poll, setPoll] = useState(null); // 투표 데이터를 저장할 '기억 상자'
  const [loading, setLoading] = useState(true); // 로딩 상태를 알려줄 '기억 상자'
  const [error, setError] = useState(null); // 에러 상태를 알려줄 '기억 상자'

  // 1. 데이터 가져오기: 이 페이지가 처음 열릴 때 딱 한 번 실행됩니다.
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // Supabase의 'polls' 테이블에서 주소의 id와 일치하는 데이터를 찾습니다.
        const { data, error } = await supabase
          .from('polls')
          .select('*')
          .eq('id', id)
          .single(); // 배열이 아닌 단일 객체로 결과를 받습니다.

        if (error) {
          throw error; // 에러가 발생하면 catch 블록으로 보냅니다.
        }

        if (data) {
          setPoll(data); // 성공적으로 데이터를 가져오면 poll 기억 상자에 저장합니다.
        }
      } catch (error) {
        setError('투표 정보를 불러오는 데 실패했습니다.');
        console.error(error);
      } finally {
        setLoading(false); // 데이터 로딩이 끝나면 로딩 상태를 해제합니다.
      }
    };

    fetchPoll();
  }, [id]); // id 값이 바뀔 때마다 이 함수를 다시 실행합니다.

  // 2. 투표하기 기능
  const handleVote = async (option) => {
    const columnToUpdate = option === 'A' ? 'option_a_votes' : 'option_b_votes';
    
    try {
      // Supabase의 'polls' 테이블에서 해당 투표의 투표 수를 1 증가시킵니다.
      const { data, error } = await supabase
        .from('polls')
        .update({ [columnToUpdate]: poll[columnToUpdate] + 1 })
        .eq('id', id)
        .select() // 업데이트된 데이터를 다시 받아옵니다.
        .single();

      if (error) {
        throw error;
      }

      // 화면에 보이는 투표 데이터를 새로운 데이터로 즉시 업데이트합니다.
      setPoll(data); 
      alert('투표가 반영되었습니다!');

    } catch (error) {
      alert('투표 처리 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px'}}>로딩 중...</div>;
  }

  // 에러가 발생했을 때 보여줄 화면
  if (error) {
    return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>{error}</div>;
  }
  
  // 투표 정보가 없을 때 보여줄 화면
  if (!poll) {
    return <div style={{textAlign: 'center', padding: '50px'}}>해당 투표를 찾을 수 없습니다.</div>;
  }

  // 투표 총합과 각 옵션의 퍼센티지를 계산합니다.
  const totalVotes = poll.option_a_votes + poll.option_b_votes;
  const optionAPercentage = totalVotes === 0 ? 0 : (poll.option_a_votes / totalVotes) * 100;
  const optionBPercentage = totalVotes === 0 ? 0 : (poll.option_b_votes / totalVotes) * 100;

  // 최종적으로 보여줄 화면
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>{poll.title}</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <button onClick={() => handleVote('A')} style={{ width: '48%', padding: '20px', fontSize: '18px', cursor: 'pointer' }}>
          {poll.option_a_text}
        </button>
        <button onClick={() => handleVote('B')} style={{ width: '48%', padding: '20px', fontSize: '18px', cursor: 'pointer' }}>
          {poll.option_b_text}
        </button>
      </div>

      <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
        <h2 style={{ margin: 0, marginBottom: '20px', textAlign: 'center' }}>투표 결과</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{poll.option_a_text}</span>
            <span>{poll.option_a_votes}표 ({optionAPercentage.toFixed(1)}%)</span>
          </div>
          <div style={{ backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
            <div style={{ width: `${optionAPercentage}%`, height: '20px', backgroundColor: '#4caf50', borderRadius: '5px', transition: 'width 0.5s ease-in-out' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{poll.option_b_text}</span>
            <span>{poll.option_b_votes}표 ({optionBPercentage.toFixed(1)}%)</span>
          </div>
          <div style={{ backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
            <div style={{ width: `${optionBPercentage}%`, height: '20px', backgroundColor: '#2196f3', borderRadius: '5px', transition: 'width 0.5s ease-in-out' }} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Vote;

