import { useState, useEffect } from 'react';

const useChatApi = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
            setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: 'bot' }]);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { messages, loading, error, sendMessage };
};

export default useChatApi;