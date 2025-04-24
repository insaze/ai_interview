import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { fetchInterviewDetails } from '../api/interviews';

const InterviewDetails = ({ onAnswerSubmit }) => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const data = await fetchInterviewDetails(id);
        if (data) {
          setInterview(data);
          setError(null);
        } else {
          setError('Interview not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load interview');
      } finally {
        setLoading(false);
      }
    };
    
    loadInterview();
  }, [id]);

  const handleAnswerChange = (taskId, answer) => {
    setAnswers(prev => ({ ...prev, [taskId]: answer }));
    if (errorStates[taskId]) {
      setErrorStates(prev => ({ ...prev, [taskId]: null }));
    }
  };

  const handleSubmit = async (taskId) => {
    if (!answers[taskId]?.trim()) {
      setErrorStates(prev => ({ ...prev, [taskId]: 'Please enter your answer' }));
      return;
    }
    
    setLoadingStates(prev => ({ ...prev, [taskId]: true }));
    setErrorStates(prev => ({ ...prev, [taskId]: null }));
    
    try {
      await onAnswerSubmit(taskId, answers[taskId]);
    } catch (error) {
      setErrorStates(prev => ({ ...prev, [taskId]: error.message || 'Submission failed' }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [taskId]: false }));
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading interview details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{interview.title}</h1>
        <h2 className={styles.company}>{interview.company}</h2>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Experience:</span>
            <span>{interview.experience}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Skills:</span>
            <span>{interview.skills}</span>
          </div>
          <a 
            href={interview.vacancy_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.vacancyLink}
          >
            View Original Job Posting
          </a>
        </div>
      </header>

      {interview.description && (
        <section className={styles.descriptionSection}>
          <h3 className={styles.sectionTitle}>Job Description</h3>
          <p className={styles.description}>{interview.description}</p>
        </section>
      )}

      <section className={styles.questionsSection}>
        <h3 className={styles.sectionTitle}>Interview Questions</h3>
        
        {interview.tasks?.length ? (
          <div className={styles.questionsContainer}>
            {interview.tasks.map(task => (
              <article key={task.id} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <h4 className={styles.questionText}>{task.question}</h4>
                  {task.result?.score && (
                    <span className={styles.scoreBadge}>
                      Score: {task.result.score}/10
                    </span>
                  )}
                </div>
                
                <textarea
                  value={answers[task.id] || ''}
                  onChange={(e) => handleAnswerChange(task.id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={5}
                  className={`${styles.answerInput} ${
                    errorStates[task.id] ? styles.errorInput : ''
                  }`}
                  disabled={!!task.result}
                />
                
                {errorStates[task.id] && (
                  <p className={styles.errorText}>{errorStates[task.id]}</p>
                )}
                
                <div className={styles.actions}>
                  <button 
                    onClick={() => handleSubmit(task.id)}
                    disabled={loadingStates[task.id] || !!task.result}
                    className={styles.submitButton}
                  >
                    {loadingStates[task.id] ? (
                      <>
                        <span className={styles.spinner}></span>
                        Submitting...
                      </>
                    ) : (
                      task.result ? 'Submitted' : 'Submit Answer'
                    )}
                  </button>
                </div>
                
                {task.result?.explanation && (
                  <div className={styles.feedbackContainer}>
                    <h5 className={styles.feedbackTitle}>Feedback:</h5>
                    <p className={styles.feedbackText}>{task.result.explanation}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.noQuestions}>No questions available yet.</p>
        )}
      </section>
    </div>
  );
};

export default InterviewDetails;
