import React, { useState, useRef, useEffect } from 'react';
import useChatApi from '../hooks/useChatApi';
import { formatChatMessage, createMarkup } from '../utils/messageFormatter';
import '../styles/chat-interface.css';

const ChatInterface = () => {
    const { messages, loading, error, sendMessage } = useChatApi();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [hasStartedChat, setHasStartedChat] = useState(false);
    
    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setHasStartedChat(true);
            sendMessage(input.trim());
            setInput('');
        }
    };

    const showEmpty = !hasStartedChat && messages.length === 1;

    return (
        <div className="chat-page">
            {/* Main content */}
            <div className="chat-main">
                {/* Top header */}
                <div className="chat-topbar">
                    <div className="topbar-content">
                        <h1 className="topbar-title">Finance Assistant</h1>
                        <p className="topbar-subtitle">
                            Get personalized advice on budgeting, saving, debt payoff, and financial goals
                        </p>
                    </div>
                </div>

                {/* Chat area */}
                <div className="chat-content">
                    <div className="chat-card">
                        {/* Messages */}
                        <div className="messages-container">
                            {showEmpty && (
                                <div className="messages-empty">
                                    <div className="empty-icon">💰</div>
                                    <h2 className="empty-title">Welcome to Your Finance Coach</h2>
                                    <p className="empty-subtitle">Ask anything about budgeting, saving, investing, or debt payoff</p>
                                    <div className="empty-examples">
                                        <div className="example-item">
                                            <div className="example-emoji">📊</div>
                                            <div className="example-text">
                                                <div className="example-label">Budget Planning</div>
                                                <div className="example-desc">How to allocate your income</div>
                                            </div>
                                        </div>
                                        <div className="example-item">
                                            <div className="example-emoji">🎯</div>
                                            <div className="example-text">
                                                <div className="example-label">Financial Goals</div>
                                                <div className="example-desc">Set and achieve your targets</div>
                                            </div>
                                        </div>
                                        <div className="example-item">
                                            <div className="example-emoji">💳</div>
                                            <div className="example-text">
                                                <div className="example-label">Debt Payoff</div>
                                                <div className="example-desc">Strategies to eliminate debt</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, index) => (
                                <div key={index} className={`message-row message-${msg.sender}`}>
                                    <div className={`message-bubble message-${msg.sender}-bubble`}>
                                        {msg.sender === 'bot' && <div className="message-avatar">🤖</div>}
                                        {msg.sender === 'error' && <div className="message-avatar error">⚠️</div>}
                                        <div className="message-content">
                                            <div
                                                className="message-text"
                                                dangerouslySetInnerHTML={createMarkup(formatChatMessage(msg.text))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="message-row message-bot">
                                    <div className="message-bubble message-bot-bubble">
                                        <div className="message-avatar">🤖</div>
                                        <div className="message-content">
                                            <div className="typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area - fixed at bottom */}
                        <div className="message-input-area">
                            <form onSubmit={handleSubmit} className="message-input-form">
                                <textarea
                                    className="message-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about budgets, savings, debt, or investing..."
                                    rows="1"
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
                                    className="message-send-btn"
                                    disabled={loading || !input.trim()}
                                    aria-label="Send message"
                                >
                                    →
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;