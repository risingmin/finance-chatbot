import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
// import any other components you need

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ChatPage />} />
        {/* Add any other routes here */}
      </Routes>
    </div>
  );
}

export default App; // Make sure App is exported as default
