import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InterviewDetails from '../components/InterviewDetails';
import { fetchInterviewDetails, validateTaskAnswer } from '../api/interviews';

const InterviewDetailsPage = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const data = await fetchInterviewDetails(id);
        setInterview(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load interview');
      } finally {
        setLoading(false);
      }
    };
    loadInterview();
  }, [id]);

  const onAnswerSubmit = async (taskId, answer) => {
    const result = await validateTaskAnswer(taskId, answer);
    // Update the interview.tasks with the new result for the submitted task
    setInterview(prev => {
      if (!prev) return prev;
      const updatedTasks = prev.tasks.map(task =>
        task.id === taskId ? { ...task, result } : task
      );
      return { ...prev, tasks: updatedTasks };
    });
    return result;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <InterviewDetails interview={interview} onAnswerSubmit={onAnswerSubmit} />;
};

export default InterviewDetailsPage;
