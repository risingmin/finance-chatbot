import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '../styles/components.css';

// Simplified component versions
const Sidebar = () => (
  <div className="sidebar">
    <h2>Finance Chatbot</h2>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/chat">Chat</a></li>
      <li><a href="/finance-tools">Finance Tools</a></li>
    </ul>
  </div>
);

const LoadingFallback = () => (
  <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
    <p>Loading...</p>
  </div>
);

// Simple content components
const HomePage = () => (
  <div className="page-container">
    <h1>Welcome to Finance Chatbot</h1>
    <p>Your personal AI assistant for financial advice</p>
    <a href="/chat" className="button">Start Chatting</a>
  </div>
);

const ChatPage = () => (
  <div className="page-container">
    <h1>Chat Interface</h1>
    <div className="chat-container">
      <div className="messages-container">
        <div className="message bot-message">
          <div className="message-bubble">How can I help you with your finances today?</div>
        </div>
      </div>
      <div className="chat-input-container">
        <input type="text" placeholder="Type your message..." className="chat-input" />
        <button className="send-button">Send</button>
      </div>
    </div>
  </div>
);

const FinanceToolsPage = () => (
  <div className="page-container">
    <h1>Finance Tools</h1>
    <p>Tools coming soon...</p>
  </div>
);

// Main App component
const App = () => {
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log("App component mounted successfully");
  }, []);
  
  // Handle errors
  if (error) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }
  
  try {
    return (
      <BrowserRouter>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/finance-tools" element={<FinanceToolsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  } catch (err) {
    console.error("Error in App render:", err);
    setError(err);
    return <LoadingFallback />;
  }
};

export default App;