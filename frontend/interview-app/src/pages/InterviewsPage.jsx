import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewList from '../components/InterviewList';
import { fetchInterviews, createInterview } from '../api/interviews';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInterviews = async () => {
      const data = await fetchInterviews();
      setInterviews(data);
    };
    loadInterviews();
  }, []);

  const handleCreateInterview = async (url) => {
    const newInterview = await createInterview(url);
    navigate(`/interviews/${newInterview.id}`);
  };

  return (
    <div>
      <h1>Interviews</h1>
      <InterviewList 
        interviews={interviews} 
        onCreateInterview={handleCreateInterview} 
      />
    </div>
  );
};

export default InterviewsPage;