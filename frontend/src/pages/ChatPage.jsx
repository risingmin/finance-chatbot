import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Configure API URL - update this to your actual backend URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://finance-chatbot-api.onrender.com/api/chat';
  
  // Log the API URL for debugging
  useEffect(() => {
    console.log('Using API URL:', API_URL);
  }, [API_URL]);

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
    try {
      const response = await axios.post(API_URL, {
        message: userInput,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      console.log('Response from API:', response.data);
      
      // Add bot response from the API
      const botMessage = { 
        id: Date.now() + 1, 
        text: response.data.response || "Sorry, I couldn't process your request.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response from chatbot:', error);
      // Add error message
      const errorMessage = { 
        id: Date.now() + 1, 
        text: "Sorry, there was an error processing your request. Please try again later.", 
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
      
      <div className="chat-container">
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
    </div>
  );
};

export default ChatPage;
