import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatChatMessage, createMarkup } from '../utils/messageFormatter';

const ChatPage = () => {
  // State variables to store our component data
  const [messages, setMessages] = useState([]); // List of chat messages
  const [input, setInput] = useState(''); // Current input text
  const [isLoading, setIsLoading] = useState(false); // Loading state while waiting for bot response
  const [apiStatus, setApiStatus] = useState('idle'); // Status of API connection
  
  // API URL from environment variables or fallback to default
  const API_URL = import.meta.env.VITE_API_URL || 'https://finance-chatbot-api.onrender.com/api/chat';
  
  // Check API connection when component loads
  useEffect(() => {
    // Function to check if API is available
    const checkApiConnection = async () => {
      try {
        // Show that we're checking the connection
        setApiStatus('checking');
        const healthEndpoint = API_URL.replace('/api/chat', '/health');
        console.log('Checking API connection to:', healthEndpoint);
        
        // Try to contact the API's health endpoint
        const response = await axios.get(healthEndpoint, {
          timeout: 5000 // Wait up to 5 seconds
        });
        
        console.log('API health check response:', response.data);
        setApiStatus('connected'); // API is working
      } catch (error) {
        // More detailed error logging
        console.error('API connection check failed:', error.message);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
        } else if (error.request) {
          console.error('No response received');
        }
        setApiStatus('error');
      }
    };
    
    // Run the check function
    checkApiConnection();
  }, []); // Empty array means this runs once when component loads

  // Function to handle sending a new message
  const handleSendMessage = async (e) => {
    // Prevent form submission from refreshing page
    e.preventDefault();
    
    // Don't do anything if the input is empty
    if (!input.trim()) return;
    
    // Add the user's message to the chat
    const userMessage = { 
      id: Date.now(), // Use timestamp as unique ID
      text: input, 
      sender: 'user' 
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Store the input and then clear it
    const userInput = input;
    setInput('');
    
    // Show loading state while waiting for bot response
    setIsLoading(true);
    
    try {
      console.log('Sending request to:', API_URL);
      console.log('Request payload:', { message: userInput });
      
      // Send the message to the API
      const response = await axios.post(API_URL, {
        message: userInput,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000 // 30 seconds timeout
      });
      
      // Log the response for debugging
      console.log('Response data:', response.data);
      
      // Get the bot's response text from wherever it is in the response
      const botResponseText = 
        response.data?.response || 
        response.data?.message || 
        response.data?.answer || 
        response.data?.text ||
        JSON.stringify(response.data);
      
      // Add the bot's response to the chat
      const botMessage = { 
        id: Date.now() + 1, // Another unique ID
        text: botResponseText,
        sender: 'bot',
        isFormatted: true // This flag tells us to apply formatting
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      // Enhanced error handling
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server');
      }
      
      // Add a more descriptive error message to the chat
      let errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I couldn't connect to the backend service. `,
        sender: 'bot'
      };
      
      if (error.response && error.response.status === 404) {
        errorMessage.text += "The API endpoint was not found (404). Please check the API URL configuration.";
      } else if (!error.response && error.request) {
        errorMessage.text += "The server didn't respond. It might be down or starting up on Render.com (which can take a few minutes after inactivity).";
      } else {
        errorMessage.text += `Error: ${error.message}`;
      }
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // Always stop showing the loading state
      setIsLoading(false);
    }
  };

  // Function to display message content with or without formatting
  const renderMessageContent = (message) => {
    // Apply formatting to bot messages only if they have the isFormatted flag
    if (message.sender === 'bot' && message.isFormatted) {
      return (
        <div 
          className="message-text" 
          dangerouslySetInnerHTML={createMarkup(formatChatMessage(message.text))} 
        />
      );
    }
    // Otherwise, just show the plain text
    return <div className="message-text">{message.text}</div>;
  };

  // The UI for our chat page
  return (
    <div className="chat-page">
      <h1>Finance Assistant</h1>
      
      {/* Show an error message if API isn't connected */}
      {apiStatus === 'error' && (
        <div className="api-status error">
          Cannot connect to backend API. Please check your connection and try again.
        </div>
      )}
      
      {/* The main chat container */}
      <div className="chat-container">
        {/* Container for all messages */}
        <div className="messages-container">
          {/* Map through messages and create a UI element for each one */}
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {renderMessageContent(message)}
            </div>
          ))}
          
          {/* Show loading indicator while waiting for response */}
          {isLoading && <div className="loading-indicator">Bot is typing...</div>}
        </div>
        
        {/* Form for sending new messages */}
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about personal finance..."
            className="message-input"
          />
          <button 
            type="submit" 
            className="send-button" 
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
      
      {/* Debug information at bottom of page */}
      <div className="debug-info" style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
        API URL: {API_URL} | Status: {apiStatus}
      </div>
    </div>
  );
};

export default ChatPage;
