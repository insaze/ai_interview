import React, { useState } from 'react';
import styles from './styles.module.css';
import { createInterview } from '../../api/interviews';

const InterviewList = ({ interviews, onCreateInterview }) => {
  const [newInterviewUrl, setNewInterviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!newInterviewUrl) return;
    setLoading(true);
    try {
      const result = await onCreateInterview(newInterviewUrl);
      if (result) {
        setNewInterviewUrl('');
      } else {
        console.log('Interview creation failed (see errors above)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {interviews.map(interview => (
          <li key={interview.id} className={styles.listItem}>
            <a href={`/interviews/${interview.id}`}>
              {interview.position} at {interview.company}
            </a>
          </li>
        ))}
      </ul>
      
      <div className={styles.createForm}>
        <h2>Create New Interview</h2>
        <input
          type="text"
          value={newInterviewUrl}
          onChange={(e) => setNewInterviewUrl(e.target.value)}
          placeholder="Enter HeadHunter vacancy URL"
          className={styles.input}
        />
        <button 
          onClick={handleCreate} 
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Creating...' : 'Create Interview'}
        </button>
      </div>
    </div>
  );
};

export default InterviewList;