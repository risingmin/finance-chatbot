import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
