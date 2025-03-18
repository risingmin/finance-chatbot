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
        console.log('Checking API connection to:', API_URL);
        
        // Try to contact the API's health endpoint
        const response = await axios.get('https://finance-chatbot-api.onrender.com/health', {
          timeout: 5000 // Wait up to 5 seconds
        });
        
        console.log('API health check response:', response.data);
        setApiStatus('connected'); // API is working
      } catch (error) {
        // If there's an error, log it and update status
        console.error('API connection check failed:', error);
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
    
    // Log what we're sending for debugging
    console.log('Sending request to:', API_URL);
    console.log('Request payload:', { message: userInput });
    
    try {
      // Send the message to the API
      const response = await axios.post(API_URL, {
        message: userInput,
        query: userInput,  // Some APIs use different field names
        prompt: userInput, // Include alternatives for flexibility
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
      // Handle errors
      console.error('Error details:', error);
      
      // Add an error message to the chat
      const errorMessage = { 
        id: Date.now() + 1, 
        text: `Error: ${error.message}. Please check the console for details.`, 
        sender: 'bot' 
      };
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
