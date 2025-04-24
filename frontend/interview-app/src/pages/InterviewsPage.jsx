import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewList from '../components/InterviewList';
import { fetchInterviews, createInterview } from '../api/interviews';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await fetchInterviews();
        setInterviews(data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load interviews');
        setInterviews([]);
      }
    };
    loadInterviews();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const handleCreateInterview = async (url) => {
    try {
      const newInterview = await createInterview(url);
      if (newInterview && newInterview.id) {
        navigate(`/interviews/${newInterview.id}`);
      } else {
        console.error('Invalid interview data received:', newInterview);
      }
    } catch (error) {
      console.error('Error creating interview:', error);
    }
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