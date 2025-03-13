import React, { useState } from 'react';
import api from '../services/api';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setIsLoading(true);
      // Add user message to chat history
      setChatHistory(prev => [...prev, { text: message, sender: 'user' }]);
      
      // This will correctly use https://finance-chatbot-api.onrender.com/chat
      const response = await api.post('/chat', { message });
      
      // Add bot response to chat history
      setChatHistory(prev => [...prev, { 
        text: response.data.response || "Sorry, I couldn't process that request.", 
        sender: 'bot' 
      }]);
      
      // Clear message input
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { 
        text: "Sorry, there was an error processing your request.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender}`}>
            {chat.text}
          </div>
        ))}
        {isLoading && <div className="loading-indicator">Bot is typing...</div>}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask something about finance..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;