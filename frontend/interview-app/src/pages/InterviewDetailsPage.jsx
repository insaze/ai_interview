import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InterviewDetails from '../components/InterviewDetails';
import { fetchInterviewDetails, validateTaskAnswer } from '../api/interviews';

const InterviewDetailsPage = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    const loadInterview = async () => {
      const data = await fetchInterviewDetails(id);
      // Добавляем поле result к каждой задаче
      const tasksWithResults = data.tasks.map(task => ({ ...task, result: null }));
      setInterview({ ...data, tasks: tasksWithResults });
    };
    loadInterview();
  }, [id]);

  const handleAnswerSubmit = async (taskId, answer) => {
    const result = await validateTaskAnswer(taskId, answer);
    setInterview(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, result } : task
      )
    }));
    return result;
  };

  return (
    <div>
      <InterviewDetails 
        interview={interview} 
        onAnswerSubmit={handleAnswerSubmit} 
      />
    </div>
  );
};

export default InterviewDetailsPage;