import React, { useState } from 'react';
import styles from './styles.module.css';
import { validateTaskAnswer } from '../../api/interviews'; // adjust path as needed

const InterviewDetails = ({ interview }) => {
  const [answers, setAnswers] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [tasksResults, setTasksResults] = useState(
    interview.tasks.reduce((acc, task) => {
      if (task.result) acc[task.id] = task.result;
      return acc;
    }, {})
  );

  const handleAnswerChange = (taskId, answer) => {
    setAnswers(prev => ({ ...prev, [taskId]: answer }));
  };

  const handleSubmit = async (taskId) => {
    const answer = answers[taskId];
    if (!answer || !answer.trim()) {
      alert('Please enter your answer before submitting.');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [taskId]: true }));

    try {
      const result = await validateTaskAnswer(taskId, answer);
      setTasksResults(prev => ({ ...prev, [taskId]: result }));
    } catch (error) {
      alert('Failed to submit answer. Please try again later.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [taskId]: false }));
    }
  };

  if (!interview) {
    return <div>Loading interview details...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{interview.title} at {interview.company}</h1>
      <p className={styles.description}>{interview.description}</p>
      
      <h2 className={styles.sectionTitle}>Questions</h2>
      <div className={styles.questionsContainer}>
        {interview.tasks.map(task => {
          const result = tasksResults[task.id];
          const isSubmitted = !!result;
          return (
            <div key={task.id} className={styles.questionCard}>
              <h3 className={styles.questionText}>{task.question}</h3>
              <textarea
                value={answers[task.id] || ''}
                onChange={(e) => handleAnswerChange(task.id, e.target.value)}
                placeholder="Your answer"
                rows={4}
                className={styles.answerInput}
                disabled={isSubmitted}
              />
              <button 
                onClick={() => handleSubmit(task.id)}
                disabled={loadingStates[task.id] || isSubmitted}
                className={styles.submitButton}
                type="button"
              >
                {loadingStates[task.id] ? 'Submitting...' : (isSubmitted ? 'Submitted' : 'Submit Answer')}
              </button>
              
              {result && (
                <div className={styles.resultContainer}>
                  <p><strong>Score:</strong> {result.score}</p>
                  <p><strong>Feedback:</strong> {result.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewDetails;
