import { API_BASE_URL } from '../config';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: error.message || 'Unknown error'
    });
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

export const fetchInterviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/interviews`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch interviews:', error.message);
    return [];
  }
};

export const createInterview = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vacancy_link: url }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to create interview:', error.message);
    return null;
  }
};

export const fetchInterviewDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interviews/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to fetch interview ${id}:`, error.message);
    return null;
  }
};

export const validateTaskAnswer = async (taskId, answer) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to validate task ${taskId}:`, error.message);
    return { 
      score: 0, 
      explanation: 'Validation service unavailable' 
    };
  }
};