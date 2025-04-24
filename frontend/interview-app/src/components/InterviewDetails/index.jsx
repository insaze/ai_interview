import React, { useState } from 'react';
import styles from './styles.module.css';

const InterviewDetails = ({ interview, onAnswerSubmit }) => {
  const [answers, setAnswers] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const handleAnswerChange = (taskId, answer) => {
    setAnswers(prev => ({ ...prev, [taskId]: answer }));
  };

  const handleSubmit = async (taskId) => {
    if (!answers[taskId]) return;
    
    setLoadingStates(prev => ({ ...prev, [taskId]: true }));
    try {
      await onAnswerSubmit(taskId, answers[taskId]);
    } finally {
      setLoadingStates(prev => ({ ...prev, [taskId]: false }));
    }
  };

  if (!interview) {
    return <div>Loading interview details...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{interview.position} at {interview.company}</h1>
      <p className={styles.description}>{interview.description}</p>
      
      <h2 className={styles.sectionTitle}>Questions</h2>
      <div className={styles.questionsContainer}>
        {interview.tasks.map(task => (
          <div key={task.id} className={styles.questionCard}>
            <h3 className={styles.questionText}>{task.question}</h3>
            <textarea
              value={answers[task.id] || ''}
              onChange={(e) => handleAnswerChange(task.id, e.target.value)}
              placeholder="Your answer"
              rows={4}
              className={styles.answerInput}
            />
            <button 
              onClick={() => handleSubmit(task.id)}
              disabled={loadingStates[task.id]}
              className={styles.submitButton}
            >
              {loadingStates[task.id] ? 'Submitting...' : 'Submit Answer'}
            </button>
            
            {task.result && (
              <div className={styles.resultContainer}>
                <p><strong>Score:</strong> {task.result.score}</p>
                <p><strong>Feedback:</strong> {task.result.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewDetails;