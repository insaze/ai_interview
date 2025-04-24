import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Using Link for navigation
import styles from './styles.module.css';

const InterviewList = ({ interviews, onCreateInterview, onDeleteInterview }) => {
  const [newInterviewUrl, setNewInterviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const handleCreate = async () => {
    if (!newInterviewUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await onCreateInterview(newInterviewUrl);
      if (success) {
        setNewInterviewUrl('');
      }
    } catch (err) {
      setError(err.message || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this interview?')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await onDeleteInterview(id);
    } catch (err) {
      alert(err.message || 'Failed to delete interview');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your Interviews</h1>
      
      {interviews.length === 0 ? (
        <p className={styles.emptyState}>No interviews yet. Create your first one!</p>
      ) : (
        <ul className={styles.list}>
          {interviews.map(interview => (
            <li key={interview.id} className={styles.listItem}>
              <Link 
                to={`/interviews/${interview.id}`} 
                className={styles.interviewLink}
              >
                <span className={styles.interviewTitle}>{interview.title}</span>
                <span className={styles.interviewCompany}>{interview.company}</span>
                <span className={styles.interviewExperience}>{interview.experience}</span>
              </Link>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDelete(interview.id, e)}
                disabled={deletingIds.has(interview.id)}
                aria-label={`Delete interview ${interview.title}`}
                type="button"
              >
                {deletingIds.has(interview.id) ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <div className={styles.createForm}>
        <h2>Create New Interview</h2>
        <input
          type="url"
          value={newInterviewUrl}
          onChange={(e) => {
            setNewInterviewUrl(e.target.value);
            setError(null);
          }}
          placeholder="Enter job vacancy URL"
          className={`${styles.input} ${error ? styles.errorInput : ''}`}
          disabled={loading}
        />
        {error && <p className={styles.errorText}>{error}</p>}
        
        <button 
          onClick={handleCreate} 
          disabled={loading}
          className={styles.button}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Creating...
            </>
          ) : (
            'Create Interview'
          )}
        </button>
      </div>
    </div>
  );
};

export default InterviewList;
