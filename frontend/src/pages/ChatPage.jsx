import React, { useState, useEffect } from 'react';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot response
    setIsLoading(true);
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1, 
        text: "This is a placeholder response from the finance bot.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
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
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
