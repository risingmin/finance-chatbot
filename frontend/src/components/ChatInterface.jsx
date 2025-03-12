import React, { useState, useRef, useEffect } from 'react';
import useChatApi from '../hooks/useChatApi';
import '../styles/components.css';

const ChatInterface = () => {
    const { messages, loading, error, sendMessage } = useChatApi();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    
    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    // Welcome message if no messages yet
    useEffect(() => {
        if (messages.length === 0) {
            sendMessage("Hi there! I'm your personal finance assistant. How can I help you today?");
        }
    }, []);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Finance Assistant</h2>
            </div>
            
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                        <div className="message-avatar">
                            {msg.sender === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className="message-bubble">
                            <div className="message-sender">
                                {msg.sender === 'user' ? 'You' : 'Finance Assistant'}
                            </div>
                            <div className="message-text">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message bot-message">
                        <div className="message-avatar">🤖</div>
                        <div className="message-bubble">
                            <div className="message-sender">Finance Assistant</div>
                            <div className="message-text typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="error-message">
                        Sorry, something went wrong. Please try again.
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="chat-input-container">
                <textarea
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about personal finance..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    className="send-button"
                    disabled={loading || !input.trim()}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;