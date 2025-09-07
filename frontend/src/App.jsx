import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your personal finance assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://finance-chatbot-api.onrender.com';

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      id: Date.now(),
      text: input, 
      sender: 'user' 
    };
    setMessages(prev => [...prev, userMessage]);
    
    const userInput = input;
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userInput,
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });
      
      const botMessage = { 
        id: Date.now() + 1,
        text: response.data.response || "Sorry, I couldn't process that request.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error:', error.message);
      const errorMessage = { 
        id: Date.now() + 1,
        text: "Sorry, I couldn't connect to the backend service. Please try again later.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Finance Assistant</h1>
      
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        height: '500px', 
        overflowY: 'auto',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            style={{ 
              marginBottom: '15px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: message.sender === 'user' ? '#007bff' : '#e9ecef',
              color: message.sender === 'user' ? 'white' : 'black',
              marginLeft: message.sender === 'user' ? '50px' : '0',
              marginRight: message.sender === 'bot' ? '50px' : '0'
            }}
          >
            {message.text}
          </div>
        ))}
        
        {isLoading && (
          <div style={{ 
            padding: '10px', 
            fontStyle: 'italic', 
            color: '#666' 
          }}>
            Bot is typing...
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about personal finance..."
          style={{ 
            flex: 1, 
            padding: '12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            fontSize: '16px'
          }}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default App;