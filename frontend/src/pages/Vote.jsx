import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom'; // 나중에 주소에서 id를 가져올 때 필요
// import { supabase } from '../supabaseClient'; // 나중에 실제 데이터 가져올 때 필요

// 투표 페이지 컴포넌트
function Vote() {
  // 지금은 실제 데이터가 없으니, 가짜 데이터(mock data)로 화면을 만들어 봅니다.
  const [poll, setPoll] = useState({
    title: '여름 휴가지 추천',
    option_a_text: '시원한 계곡',
    option_b_text: '탁 트인 바다',
    option_a_votes: 8,
    option_b_votes: 5,
  });

  // 투표 총합과 각 옵션의 퍼센티지를 계산합니다.
  const totalVotes = poll.option_a_votes + poll.option_b_votes;
  const optionAPercentage = totalVotes === 0 ? 0 : (poll.option_a_votes / totalVotes) * 100;
  const optionBPercentage = totalVotes === 0 ? 0 : (poll.option_b_votes / totalVotes) * 100;

  // 이 컴포넌트가 화면에 보여줄 내용 (JSX)
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      {/* 투표 제목 */}
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>{poll.title}</h1>

      {/* 옵션 A/B 투표 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <button style={{ width: '48%', padding: '20px', fontSize: '18px', cursor: 'pointer' }}>
          {poll.option_a_text}
        </button>
        <button style={{ width: '48%', padding: '20px', fontSize: '18px', cursor: 'pointer' }}>
          {poll.option_b_text}
        </button>
      </div>

      {/* 투표 결과 바 */}
      <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
        <h2 style={{ margin: 0, marginBottom: '20px', textAlign: 'center' }}>투표 결과</h2>
        
        {/* 옵션 A 결과 */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{poll.option_a_text}</span>
            <span>{poll.option_a_votes}표 ({optionAPercentage.toFixed(1)}%)</span>
          </div>
          <div style={{ backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
            <div 
              style={{ 
                width: `${optionAPercentage}%`, 
                height: '20px', 
                backgroundColor: '#4caf50', 
                borderRadius: '5px' 
              }}
            />
          </div>
        </div>

        {/* 옵션 B 결과 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{poll.option_b_text}</span>
            <span>{poll.option_b_votes}표 ({optionBPercentage.toFixed(1)}%)</span>
          </div>
          <div style={{ backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
            <div 
              style={{ 
                width: `${optionBPercentage}%`, 
                height: '20px', 
                backgroundColor: '#2196f3', 
                borderRadius: '5px' 
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Vote;
