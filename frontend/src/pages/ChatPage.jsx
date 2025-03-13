import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('idle');
  
  // Vite uses import.meta.env instead of process.env
  const API_URL = import.meta.env.VITE_API_URL || 'https://finance-chatbot-api.onrender.com/api/chat';
  
  useEffect(() => {
    // Check API connection on component mount
    const checkApiConnection = async () => {
      try {
        setApiStatus('checking');
        console.log('Checking API connection to:', API_URL);
        
        // Make a simple test request to verify connection
        const response = await axios.get('https://finance-chatbot-api.onrender.com/health', {
          timeout: 5000
        });
        
        console.log('API health check response:', response.data);
        setApiStatus('connected');
      } catch (error) {
        console.error('API connection check failed:', error);
        setApiStatus('error');
      }
    };
    
    checkApiConnection();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    
    // Send to backend
    setIsLoading(true);
    
    // Log the request data
    console.log('Sending request to:', API_URL);
    console.log('Request payload:', { message: userInput });
    
    try {
      // Try different payload formats that the backend might expect
      const response = await axios.post(API_URL, {
        message: userInput,
        query: userInput, // Alternative field name
        prompt: userInput, // Another alternative
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000 // 30 seconds timeout
      });
      
      console.log('Full API response:', response);
      console.log('Response data:', response.data);
      
      // Check various response structures
      const botResponseText = 
        response.data?.response || 
        response.data?.message || 
        response.data?.answer || 
        response.data?.text ||
        JSON.stringify(response.data);
      
      // Add bot response from the API
      const botMessage = { 
        id: Date.now() + 1, 
        text: botResponseText,
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error details:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
      }
      
      // Add error message
      const errorMessage = { 
        id: Date.now() + 1, 
        text: `Error: ${error.message}. Please check the console for details.`, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <h1>Finance Assistant</h1>
      
      {apiStatus === 'error' && (
        <div className="api-status error"></div>
          Cannot connect to backend API. Please check your connection and try again.
        </div>
      )}
      
      <div className="chat-container"></div>
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && <div className="loading-indicator">Bot is typing...</div>}
        </div>
        
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about personal finance..."
            className="message-input"
          />
          <button type="submit" className="send-button" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
      
      <div className="debug-info" style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
        API URL: {API_URL} | Status: {apiStatus}
      </div>
    </div>
  );
};

export default ChatPage;
