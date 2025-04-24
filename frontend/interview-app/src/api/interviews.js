export const fetchInterviews = async () => {
    const response = await fetch('/interviews');
    return await response.json();
  };
  
  export const createInterview = async (url) => {
    const response = await fetch(`${API_BASE_URL}/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    return await response.json();
  };
  
  export const fetchInterviewDetails = async (id) => {
    const response = await fetch(`${API_BASE_URL}/interviews/${id}`);
    return await response.json();
  };
  
  export const validateTaskAnswer = async (taskId, answer) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer }),
    });
    return await response.json();
  };