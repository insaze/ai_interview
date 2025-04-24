import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewList from '../components/InterviewList';
import { fetchInterviews, createInterview, deleteInterview } from '../api/interviews';

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

  const handleDeleteInterview = async (id) => {
    await deleteInterview(id);
    setInterviews(prev => prev.filter(i => i.id !== id));
  };

  const handleInterviewClick = (id) => {
    navigate(`/interviews/${id}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h1>Interviews</h1>
      <InterviewList 
        interviews={interviews} 
        onCreateInterview={handleCreateInterview}
        onInterviewClick={handleInterviewClick}
        onDeleteInterview={handleDeleteInterview}
      />
    </div>
  );
};

export default InterviewsPage;
