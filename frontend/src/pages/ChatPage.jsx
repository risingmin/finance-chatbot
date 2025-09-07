import React, { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { formatChatMessage, createMarkup } from '../utils/messageFormatter';

const ChatPage = () => {
  // State variables to store our component data
  const [messages, setMessages] = useState([]); // List of chat messages
  const [input, setInput] = useState(''); // Current input text
  const [isLoading, setIsLoading] = useState(false); // Loading state while waiting for bot response
  const [apiStatus, setApiStatus] = useState('idle'); // Status of API connection
  const [retryCount, setRetryCount] = useState(0); // Track API connection retry attempts
  const [lastAttemptTime, setLastAttemptTime] = useState(null); // Track when we last tried to connect
  
  // In dev, requests go through Vite proxy; in prod, api has full baseURL
  const API_ENDPOINT = '/api/chat';
  const ALT_API_ENDPOINT = '/chat';

  console.log('Using API endpoints:', { primary: API_ENDPOINT, alternative: ALT_API_ENDPOINT });
  
  // Function to check if API is available - defined with useCallback so we can reference it in retries
  const checkApiConnection = useCallback(async () => {
    try {
      setLastAttemptTime(new Date().toLocaleTimeString());
      setApiStatus('checking');
      
      // Try different endpoints in sequence (relative paths in dev)
      const endpointsToTry = [
        { url: '/health', name: 'Health' },
        { url: '/api/test-gemini', name: 'Test Gemini' }
      ];
      
      for (const endpoint of endpointsToTry) {
        try {
          console.log(`Trying ${endpoint.name} endpoint at: ${endpoint.url}`);
          const response = await api.get(endpoint.url, {
            timeout: 30000,
            headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
          });
          
          console.log(`${endpoint.name} endpoint responded:`, response.data);
          setApiStatus('connected');
          return true;
        } catch (error) {
          console.log(`${endpoint.name} endpoint failed:`, error.message);
          // Continue to next endpoint
        }
      }
      
      // If we get here, all endpoints failed
      throw new Error('All API endpoints failed to respond');
      
    } catch (error) {
      // More detailed error logging
      console.error('API connection check failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
          });
          
          console.log(`${endpoint.name} endpoint responded:`, response.data);
          setApiStatus('connected');
          return true;
        } catch (error) {
          console.log(`${endpoint.name} endpoint failed:`, error.message);
          // Continue to next endpoint
        }
      }
      
      // If we get here, all endpoints failed
      throw new Error("All API endpoints failed to respond");
      
    } catch (error) {
      // More detailed error logging
      console.error('API connection check failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received');
      }
      
      // Handle Render's cold start behavior
      if (retryCount >= 3) {
        setApiStatus('error');
      } else {
        setApiStatus('retrying');
      }
      return false;
    }
  }, [BASE_URL, retryCount]);
  
  // Manual retry function for user-initiated retries
  const handleManualRetry = () => {
    setRetryCount(0);  // Reset retry count
    setApiStatus('idle'); // Reset status to trigger the useEffect
  };
  
  // Add a welcome message when the component mounts
  useEffect(() => {
    // Only add welcome message if we don't already have messages
    if (messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: "Hello! I'm your personal finance assistant. How can I help you today?",
        sender: 'bot',
        isFormatted: true
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);
  
  // Check API connection when component loads or when retry is triggered
  useEffect(() => {
    if (apiStatus === 'idle' || apiStatus === 'retrying') {
      const attemptConnection = async () => {
        const success = await checkApiConnection();
        
        // If not successful and we haven't retried too many times, try again after a delay
        if (!success && retryCount < 3) {
          // Use exponential backoff: 5s, 10s, 20s
          const retryDelay = 5000 * Math.pow(2, retryCount);
          console.log(`Will retry API connection in ${retryDelay/1000}s...`);
          
          setTimeout(() => {
            setRetryCount(prevCount => prevCount + 1);
          }, retryDelay);
        }
      };
      
      attemptConnection();
    }
  }, [checkApiConnection, retryCount, apiStatus]);

  // Function to handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
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
      console.log('Attempting to send request to:', API_URL);
      
      // Try to reconnect if in error state
      if (apiStatus === 'error') {
        const reconnected = await checkApiConnection();
        if (!reconnected) {
          // If we still can't connect, but haven't tried recently, give it another chance
          // This helps with Render's cold start behavior
          throw new Error('Backend API is unavailable. It may be in sleep mode and take a few minutes to start.');
        }
      }
      
      // First try the primary API URL
      let response;
      try {
        response = await axios.post(API_URL, {
          message: userInput,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Client-Version': '1.0.0',  // Add client version for debugging
            'X-Request-Time': new Date().toISOString()  // Timestamp 
          },
          timeout: 45000,  // 45 seconds timeout
          // Add request ID for tracing
          transformRequest: [(data, headers) => {
            headers['X-Request-ID'] = Date.now().toString(36) + Math.random().toString(36).substr(2);
            return JSON.stringify(data);
          }]
        });
        
        console.log('Response received from primary URL:', response.data);
      } catch (primaryError) {
        // If the primary URL fails with 404, try the alternative URL
        if (primaryError.response?.status === 404) {
          console.log('Primary API URL returned 404, trying alternative URL:', ALT_API_URL);
          response = await axios.post(ALT_API_URL, {
            message: userInput,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: 45000
          });
          console.log('Response received from alternative URL:', response.data);
        } else {
          // If it's not a 404 error, re-throw it
          throw primaryError;
        }
      }
      
      console.log('Response data:', response.data);
      setApiStatus('connected');
      
      const botResponseText = 
        response.data?.response || 
        response.data?.message || 
        response.data?.answer || 
        response.data?.text ||
        JSON.stringify(response.data);
      
      const botMessage = { 
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        isFormatted: true
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error details:', error.message);
      // Add deeper inspection of server error responses
      if (error.response) {
        console.error('Server responded with error status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server. Request details:', {
          url: error.request.url || API_URL,
          method: error.request.method || 'POST',
          timeout: error.request.timeout || '45000ms'
        });
      }
      
      setApiStatus('error');
      
      let errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I couldn't connect to the backend service. `,
        sender: 'bot'
      };
      
      if (error.response && error.response.status === 404) {
        errorMessage.text += "The API endpoint was not found (404). I tried multiple URL formats but none worked. The API might be configured differently than expected.";
        
        // Add more technical details for debugging
        console.error('404 Not Found Error Details:', {
          primaryUrl: API_URL,
          alternativeUrl: ALT_API_URL,
          baseUrl: BASE_URL,
          responseData: error.response.data,
          headers: error.response.headers
        });
      } else if (!error.response && error.request) {
        errorMessage.text += "The server didn't respond. It may be in sleep mode on Render.com. This is normal behavior and it can take up to 2-3 minutes to start up. Please try again in a moment.";
      } else {
        errorMessage.text += `Error: ${error.message}`;
      }
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to display message content with or without formatting
  const renderMessageContent = (message) => {
    if (message.sender === 'bot' && message.isFormatted) {
      return (
        <div 
          className="message-text" 
          dangerouslySetInnerHTML={createMarkup(formatChatMessage(message.text))} 
        />
      );
    }
    return <div className="message-text">{message.text}</div>;
  };

  return (
    <div className="chat-page">
      <h1>Finance Assistant</h1>
      
      {/* Add more detailed API connection info */}
      {apiStatus === 'checking' && (
        <div className="api-status checking">
          Connecting to backend API at {BASE_URL}... This may take a moment if the service is starting up.
        </div>
      )}
      
      {apiStatus === 'retrying' && (
        <div className="api-status retrying">
          Connection to backend API failed. Retrying... (Attempt {retryCount + 1}/4)
          <p style={{fontSize: '14px', marginTop: '5px'}}>
            Note: Render.com free tier services go to sleep after periods of inactivity and can take 1-3 minutes to wake up.
          </p>
          <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
            Last attempt: {lastAttemptTime || 'N/A'}
          </p>
        </div>
      )}
      
      {apiStatus === 'error' && (
        <div className="api-status error">
          <p>Cannot connect to backend API. The service may be in sleep mode or experiencing issues.</p>
          <p style={{fontSize: '14px', marginTop: '5px'}}>
            Free Render.com services take 1-3 minutes to wake up when they haven't been used recently.
          </p>
          <button 
            onClick={handleManualRetry} 
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
            Last attempt: {lastAttemptTime || 'N/A'}
          </p>
        </div>
      )}
      
      {/* The main chat container */}
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {renderMessageContent(message)}
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
          <button 
            type="submit" 
            className="send-button" 
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
      
      <div className="debug-info" style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
        API Base URL: {BASE_URL} | Full Endpoint: {API_URL} | Status: {apiStatus} | Retry count: {retryCount}/3
      </div>
    </div>
  );
};

export default ChatPage;
