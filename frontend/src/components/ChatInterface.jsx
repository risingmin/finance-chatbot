import React, { useContext, useState } from 'react';
import { ChatContext } from '../contexts/ChatContext';

const ChatInterface = () => {
    const { messages, sendMessage } = useContext(ChatContext);
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="chat-interface">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatInterface;