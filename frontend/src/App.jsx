import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your personal finance assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://finance-chatbot-api.onrender.com';

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/health`, {
        timeout: 10000
      });
      const testMessage = { 
        id: Date.now(),
        text: `✅ Backend connection successful! Status: ${response.data.status}`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, testMessage]);
    } catch (error) {
      const errorMessage = { 
        id: Date.now(),
        text: `❌ Backend connection failed: ${error.message}`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.error('Error details:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorText = "Sorry, I couldn't connect to the backend service. ";
      
      if (error.response?.status === 404) {
        errorText += "The API endpoint was not found (404).";
      } else if (error.response?.status === 500) {
        errorText += "The backend server had an error (500).";
      } else if (!error.response) {
        errorText += "The backend server didn't respond. It may be sleeping on Render.com.";
      } else {
        errorText += `Error: ${error.message}`;
      }
      
      const errorMessage = { 
        id: Date.now() + 1,
        text: errorText,
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
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={testConnection}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Test Backend Connection
        </button>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          API URL: {API_URL}
        </div>
      </div>
      
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