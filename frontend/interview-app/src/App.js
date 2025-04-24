import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import InterviewsPage from './pages/InterviewsPage';
import InterviewDetailsPage from './pages/InterviewDetailsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InterviewsPage />} />
        <Route path="/interviews/:id" element={<InterviewDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;