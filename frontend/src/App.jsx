import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import ApiTester from './components/ApiTester';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav style={{ 
          padding: '10px 20px', 
          backgroundColor: '#f8f9fa', 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between' 
        }}>
          <div>
            <strong>Finance Chatbot</strong>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/chat">Chat</Link>
            <Link to="/api-test">API Test</Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/api-test" element={<ApiTester />} />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
