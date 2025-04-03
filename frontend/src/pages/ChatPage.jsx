import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { formatChatMessage, createMarkup } from '../utils/messageFormatter';

const ChatPage = () => {
  // State variables to store our component data
  const [messages, setMessages] = useState([]); // List of chat messages
  const [input, setInput] = useState(''); // Current input text
  const [isLoading, setIsLoading] = useState(false); // Loading state while waiting for bot response
  const [apiStatus, setApiStatus] = useState('idle'); // Status of API connection
  const [retryCount, setRetryCount] = useState(0); // Track API connection retry attempts
  
  // API URL from environment variables or fallback to default
  const API_URL = import.meta.env.VITE_API_URL || 'https://finance-chatbot-api.onrender.com/api/chat';
  
  // Function to check if API is available - defined with useCallback so we can reference it in retries
  const checkApiConnection = useCallback(async () => {
    try {
      // Show that we're checking the connection
      setApiStatus('checking');
      // First try the direct health endpoint
      const healthEndpoint = `${API_URL.split('/api/')[0]}/health`;
      console.log('Checking API connection to:', healthEndpoint);
      
      // Try to contact the API's health endpoint
      const response = await axios.get(healthEndpoint, {
        timeout: 15000 // Increased from 5000 to 15000 (15 seconds)
      });
      
      console.log('API health check response:', response.data);
      setApiStatus('connected'); // API is working
      return true;
    } catch (error) {
      // More detailed error logging
      console.error('API connection check failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received');
      }
      
      setApiStatus(retryCount >= 2 ? 'error' : 'retrying');
      return false;
    }
  }, [API_URL, retryCount]);
  
  // Add a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Hello! I'm your personal finance assistant. How can I help you today?",
      sender: 'bot',
      isFormatted: true
    };
    setMessages([welcomeMessage]);
  }, []);
  
  // Check API connection when component loads
  useEffect(() => {
    const attemptConnection = async () => {
      const success = await checkApiConnection();
      
      // If not successful and we haven't retried too many times, try again after a delay
      if (!success && retryCount < 2) {
        const retryDelay = (retryCount + 1) * 5000; // 5s, then 10s
        console.log(`Will retry API connection in ${retryDelay/1000}s...`);
        
        setTimeout(() => {
          setRetryCount(prevCount => prevCount + 1);
        }, retryDelay);
      }
    };
    
    attemptConnection();
  }, [checkApiConnection, retryCount]); // Dependency on retryCount will trigger retries

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
      
      // If API is in error state, try reconnecting first
      if (apiStatus === 'error') {
        const reconnected = await checkApiConnection();
        if (!reconnected) {
          throw new Error('API is currently unavailable');
        }
      }
      
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
      
      // Update API status to connected since we got a response
      setApiStatus('connected');
      
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
      
      // Set API status to error
      setApiStatus('error');
      
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
      
      {/* Show appropriate API status message */}
      {apiStatus === 'checking' && (
        <div className="api-status checking">
          Connecting to backend API...
        </div>
      )}
      
      {apiStatus === 'retrying' && (
        <div className="api-status retrying">
          Connection to backend API failed. Retrying... (Attempt {retryCount + 1}/3)
        </div>
      )}
      
      {apiStatus === 'error' && (
        <div className="api-status error">
          Cannot connect to backend API. The service may be starting up or experiencing issues. Your messages will still be displayed but responses may be delayed.
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
        API URL: {API_URL} | Status: {apiStatus} | Retry count: {retryCount}/3
      </div>
    </div>
  );
};

export default ChatPage;
