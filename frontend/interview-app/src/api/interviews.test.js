import {
    fetchInterviews,
    createInterview,
    fetchInterviewDetails,
    validateTaskAnswer
  } from './interviews';
  
  global.fetch = jest.fn();
  
  describe('API functions', () => {
    beforeEach(() => {
      fetch.mockClear();
    });
  
    test('fetchInterviews - success', async () => {
      const mockData = [{ id: 1, title: 'Interview 1' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });
  
      const result = await fetchInterviews();
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/interviews');
    });
  
    test('fetchInterviews - failure', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const result = await fetchInterviews();
      expect(result).toEqual([]);
    });
  
    test('createInterview - success', async () => {
      const mockData = { id: 1 };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });
  
      const result = await createInterview('test-url');
      expect(result).toEqual(mockData);
    });
});