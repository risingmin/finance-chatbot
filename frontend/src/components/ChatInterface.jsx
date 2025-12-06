import React, { useState, useRef, useEffect } from 'react';
import useChatApi from '../hooks/useChatApi';
import { formatChatMessage, createMarkup } from '../utils/messageFormatter';

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

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <div>
                    <div className="chat-title">Finance Assistant</div>
                    <div className="chat-subtitle">Ask about budgeting, saving, debt payoff, and goals.</div>
                </div>
                <div className="pill">Live</div>
            </div>

            <div className="chat-stream">
                {messages.length === 0 && (
                    <div className="empty-state">Start by asking anything about your finances.</div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <div className="chat-avatar" aria-hidden>
                            {msg.sender === 'user' ? '🧑' : '🤖'}
                        </div>
                        <div className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                            <div className="message-meta">{msg.sender === 'user' ? 'You' : 'Finance Coach'}</div>
                            <div
                                className="message-text"
                                dangerouslySetInnerHTML={createMarkup(formatChatMessage(msg.text))}
                            />
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="chat-message">
                        <div className="chat-avatar" aria-hidden>🤖</div>
                        <div className="chat-bubble">
                            <div className="message-meta">Finance Coach</div>
                            <div className="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="chat-message">
                        <div className="chat-avatar" aria-hidden>⚠️</div>
                        <div className="chat-bubble">
                            <div className="message-meta">Connection issue</div>
                            <div className="message-text">{error}</div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-bar">
                <textarea
                    className="chat-textarea"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about budgets, savings plans, or debt payoff..."
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
                    className="btn btn-primary send-button"
                    disabled={loading || !input.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;