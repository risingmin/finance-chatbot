import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (message) => {
        setLoading(true);
        // Logic to send message to backend and receive response
        // Example: const response = await api.sendChatMessage(message);
        // setMessages([...messages, { text: message, sender: 'user' }, { text: response, sender: 'bot' }]);
        setLoading(false);
    };

    return (
        <ChatContext.Provider value={{ messages, loading, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};